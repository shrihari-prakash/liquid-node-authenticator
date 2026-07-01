import { ForbiddenError, CustomError, isLiquidError } from './constants/errors.js'
import Cache from './service/cache.js'
import Logger from './service/logger.js'
import ScopeManager from './service/scope-manager.js'
import { ApiClient } from './service/api-client.js'
import type { CacheOptions } from './service/cache.js'
import type { LoggerInterface } from './service/logger.js'

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
  logger: LoggerInterface | any;
  scopeManager: ScopeManager;
  apiClient: ApiClient;

  /**
   * Creates an instance of LiquidNodeAuthenticator.
   *
   * @constructor
   * @param {LiquidNodeAuthenticator.Options} options - Configuration options for the LiquidNodeAuthenticator.
   */
  constructor ({ host, clientId, clientSecret, scope = '*', cacheOptions, debugging = true, logger }: LiquidNodeAuthenticator.Options) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.scope = Array.isArray(scope) ? scope.join(',') : scope
    this.host = host
    this.cache = new Cache(cacheOptions)
    this.logger = logger || new Logger(debugging)
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
  async authenticate (token: string): Promise<LiquidNodeAuthenticator.TokenInfo> {
    try {
      if (!token) { throw new ForbiddenError() }
      const cacheKey = `token:${token}`
      const cacheResult = await this.cache.get(cacheKey)
      if (cacheResult) {
        if (cacheResult.ok === 1) {
          this.logger.debug(`Token resolved from cache for key ${cacheKey}`)
          return cacheResult.data.tokenInfo
        } else {
          this.logger.debug(`Cached token is invalid for key ${cacheKey}, rejecting`)
          throw new ForbiddenError()
        }
      }

      const clientToken = (await this.getAccessToken()).accessToken;
      if (!clientToken) {
        this.logger.warn('No client access token available, cannot introspect')
        throw new ForbiddenError()
      }

      this.logger.debug('Introspecting token via remote')
      const { status, result } = await this.apiClient.introspectToken(token, clientToken);

      if (status !== 200 || !result.ok) {
        if (status === 401) {
          this.logger.warn('Client access token rejected by introspect endpoint (401), invalidating service token')
          this.accessToken = null
          this.accessTokenExpiry = new Date(0)
        } else {
          this.logger.debug(`Token introspection returned status ${status}, rejecting`)
        }
        throw new ForbiddenError()
      }
      // No need to await. Cache can always be set again if failed.
      this.cache.set(cacheKey, result)
      this.logger.debug(`Token introspected successfully, cached at ${cacheKey}`)
      return result.data.tokenInfo
    } catch (error) {
      if (isLiquidError(error)) { throw error }
      this.logger.error('Unexpected error during token authentication:', error)
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
  async getAccessToken (): Promise<LiquidNodeAuthenticator.TokenResponse> {
    try {
      const now = new Date()
      if (this.accessTokenExpiry.getTime() <= now.getTime()) {
        const expiry = new Date()
        this.logger.debug('Service access token expired or missing, fetching from remote')
        const result = await this.apiClient.getClientCredentials(this.clientId, this.clientSecret, this.scope);

        this.accessToken = result.access_token
        expiry.setSeconds(expiry.getSeconds() + result.expires_in)
        this.accessTokenExpiry = expiry
        this.logger.info(`Service access token refreshed, expires at ${this.accessTokenExpiry.toISOString()}`)
      } else {
        this.logger.debug(`Service access token valid, expires at ${this.accessTokenExpiry.toISOString()}`)
      }
      return {
        accessToken: this.accessToken,
        accessTokenExpiry: this.accessTokenExpiry
      }
    } catch (error) {
      if (isLiquidError(error)) { throw error }
      this.logger.error('Unexpected error fetching service access token:', error)
      throw new CustomError('UnknownError', 500)
    }
  }

  /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The token object returned from authenticate().
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  checkTokenScope (scope: string, token: LiquidNodeAuthenticator.TokenInfo | any): boolean {
    return this.scopeManager.checkTokenScope(scope, token)
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace LiquidNodeAuthenticator {
  export interface TokenInfo {
    accessToken?: string;
    accessTokenExpiresAt?: string;
    scope?: string;
    user?: {
      [key: string]: any;
    };
    [key: string]: any;
  }

  export interface TokenResponse {
    accessToken: string | null;
    accessTokenExpiry: Date;
  }

  export interface Options {
    host: string;
    clientId: string;
    clientSecret: string;
    scope?: string | string[];
    cacheOptions?: CacheOptions;
    debugging?: boolean;
    logger?: LoggerInterface | any;
  }

  /** @deprecated Use Options instead */
  export type ConnectorOptions = Options;
  /** @deprecated Use Options instead */
  export type LiquidNodeAuthenticatorOptions = Options;
}

export = LiquidNodeAuthenticator
