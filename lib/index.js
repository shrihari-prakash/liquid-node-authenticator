import { ForbiddenError, UnauthorizedError, NetworkError, CustomError, isLiquidError } from './constants/errors.js'
import Cache from './service/cache.js'
import Logger from './service/logger.js'
import ScopeManager from './service/scope-manager.js'

/**
 * LiquidNodeAuthenticator provides methods for authenticating and obtaining access tokens
 * from a Liquid OAuth server.
 *
 * @class
 */
class LiquidNodeAuthenticator {
  accessToken = null
  accessTokenExpiry = new Date(0)

  /**
     * Creates an instance of LiquidNodeAuthenticator.
     *
     * @constructor
     * @param {Object} options - Configuration options for the LiquidNodeAuthenticator.
     * @param {string} options.host - The base URL of the Liquid OAuth server.
     * @param {string} options.clientId - The client ID for authentication.
     * @param {string} options.clientSecret - The client secret for authentication.
     * @param {(string|string[])} [options.scope="*"] - The OAuth scope(s) for authentication.
     * @param {Object} [options.cacheOptions] - Options for configuring the cache.
     * @param {Object} [options.cacheOptions.client] - The caching client (e.g., Redis client) to use.
     * @param {number} [options.cacheOptions.expire] - The expiration time for cached items in seconds.
     * @param {boolean} [options.debugging] - Specifies if logs should be printed to console.
     */
  constructor ({ host, clientId, clientSecret, scope = '*', cacheOptions, debugging = true }) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.scope = scope
    if (Array.isArray(this.scope)) {
      this.scope = this.scope.join(',')
    }
    this.host = host
    this.cache = new Cache(cacheOptions)
    this.logger = new Logger(debugging)
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
  async authenticate (token) {
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
      const api = `${this.host}/oauth/introspect`
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(await this.getAccessToken()).accessToken}`
      }
      const body = JSON.stringify({ token })
      let response
      try {
        response = await fetch(api, { method: 'POST', headers, body })
      } catch {
        throw new NetworkError()
      }
      const result = await response.json()
      this.logger.debug(`Cache written for ${cacheKey}`)
      if (response.status !== 200 || !result.ok) {
        if (response.status === 401) {
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
  async getAccessToken () {
    try {
      const now = new Date()
      if (this.accessTokenExpiry.getTime() <= now.getTime()) {
        const expiry = new Date()
        const api = `${this.host}/oauth/token`
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        const body = new URLSearchParams()
        body.append('grant_type', 'client_credentials')
        body.append('client_id', this.clientId)
        body.append('client_secret', this.clientSecret)
        body.append('scope', this.scope)
        let response
        try {
          response = await fetch(api, { method: 'POST', headers, body })
        } catch {
          throw new NetworkError()
        }
        if (response.status !== 200) {
          throw new UnauthorizedError()
        }
        const result = await response.json()
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
  checkTokenScope (scope, token) {
    return this.scopeManager.checkTokenScope(scope, token)
  }
}

export default LiquidNodeAuthenticator
