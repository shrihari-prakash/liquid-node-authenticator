import { ForbiddenError, CustomError, isLiquidError } from './constants/errors.js'
import Cache from './service/cache.js'
import Logger from './service/logger.js'
import ScopeManager from './service/scope-manager.js'
import { ApiClient } from './service/api-client.js'

interface LiquidNodeAuthenticatorOptions {
  host: string;
  clientId: string;
  clientSecret: string;
  scope?: string | string[];
  cacheOptions?: any;
  debugging?: boolean;
}

/**
 * LiquidNodeAuthenticator provides methods for authenticating and obtaining access tokens
 * from a Liquid OAuth server.
 *
 * @class
 */
class LiquidNodeAuthenticator {
  accessToken: string | null = null
  accessTokenExpiry: Date = new Date(0)
  clientId: string;
  clientSecret: string;
  scope: string;
  host: string;
  cache: Cache;
  logger: Logger;
  scopeManager: ScopeManager;
  apiClient: ApiClient;

  /**
   * Creates an instance of LiquidNodeAuthenticator.
   *
   * @constructor
   * @param {LiquidNodeAuthenticatorOptions} options - Configuration options for the LiquidNodeAuthenticator.
   */
  constructor ({ host, clientId, clientSecret, scope = '*', cacheOptions, debugging = true }: LiquidNodeAuthenticatorOptions) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.scope = Array.isArray(scope) ? scope.join(',') : scope
    this.host = host
    this.cache = new Cache(cacheOptions)
    this.logger = new Logger(debugging)
    this.apiClient = new ApiClient({ host: this.host })
    this.scopeManager = new ScopeManager(this.host, this.logger)
    this.logger.info(
      'Initialized Liquid Node Connector for client ' + clientId
    )
  }

  /**
    * Authenticates a user using the provided token.
    *
    * @async
    * @param {string} token - The authentication token to be validated.
    * @throws {ForbiddenError} If the token is invalid or unauthorized.
    * @throws {NetworkError} If a network error occurs during the authentication process.
    * @returns {Object} The user's token information if authentication is successful.
    */
  async authenticate (token: string): Promise<any> {
    try {
      if (!token) { throw new ForbiddenError() }
      const cacheKey = `token:${token}`
      const cacheResult = await this.cache.get(cacheKey)
      if (cacheResult) {
        if (cacheResult.ok === 1) {
          return cacheResult.data.tokenInfo
        } else {
          throw new ForbiddenError()
        }
      }

      const clientToken = (await this.getAccessToken()).accessToken;
      if (!clientToken) {
         throw new ForbiddenError()
      }

      const { status, result } = await this.apiClient.introspectToken(token, clientToken);
      
      this.logger.debug(`Cache written for ${cacheKey}`)
      if (status !== 200 || !result.ok) {
        if (status === 401) {
          this.accessToken = null
          this.accessTokenExpiry = new Date(0)
        }
        throw new ForbiddenError()
      }
      // No need to await. Cache can always be set again if failed.
      this.cache.set(cacheKey, result)
      return result.data.tokenInfo
    } catch (error) {
      this.logger.error(error)
      if (isLiquidError(error)) { throw error }
      throw new CustomError('UnknownError', 500)
    }
  }

  /**
     * Retrieves an access token, either from memory or by making a request to the Liquid instance.
     *
     * @async
     * @throws {NetworkError} If a network error occurs during the access token retrieval.
     * @throws {UnauthorizedError} If the OAuth server returns an unauthorized status.
     * @returns {Object} The access token and its expiration details.
     */
  async getAccessToken (): Promise<{ accessToken: string | null; accessTokenExpiry: Date }> {
    try {
      const now = new Date()
      if (this.accessTokenExpiry.getTime() <= now.getTime()) {
        const expiry = new Date()
        
        const result = await this.apiClient.getClientCredentials(this.clientId, this.clientSecret, this.scope);

        this.accessToken = result.access_token
        expiry.setSeconds(expiry.getSeconds() + result.expires_in)
        this.accessTokenExpiry = expiry
        this.logger.debug('Access token returned from remote.')
      } else {
        this.logger.debug('Access token returned from memory.')
      }
      return {
        accessToken: this.accessToken,
        accessTokenExpiry: this.accessTokenExpiry
      }
    } catch (error) {
      this.logger.error(error)
      if (isLiquidError(error)) { throw error }
      throw new CustomError('UnknownError', 500)
    }
  }

  /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The Express response object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  checkTokenScope (scope: string, token: any): boolean {
    return this.scopeManager.checkTokenScope(scope, token)
  }
}

export default LiquidNodeAuthenticator
