(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('mollitia')) :
  typeof define === 'function' && define.amd ? define(['mollitia'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.liquidNodeAuthenticator = factory(global.mollitia));
})(this, (function (mollitia) { 'use strict';

  /**
   * Custom error class representing a Forbidden error (HTTP 403).
   *
   * @class ForbiddenError
   * @extends {Error}
   */
  class ForbiddenError extends Error {
    /**
       * Creates an instance of ForbiddenError.
       *
       * @constructor
       * @param {string} [message] - Optional error message.
       */
    constructor (message) {
      super(message);
      this.code = 403;
      this.name = 'ForbiddenError';
    }
  }

  /**
   * Custom error class representing an Unauthorized error (HTTP 401).
   *
   * @class UnauthorizedError
   * @extends {Error}
   */
  class UnauthorizedError extends Error {
    /**
       * Creates an instance of UnauthorizedError.
       *
       * @constructor
       * @param {string} [message] - Optional error message.
       */
    constructor (message) {
      super(message);
      this.code = 401;
      this.name = 'UnauthorizedError';
    }
  }

  /**
   * Custom error class representing a Network error (HTTP 503).
   *
   * @class NetworkError
   * @extends {Error}
   */
  class NetworkError extends Error {
    /**
       * Creates an instance of NetworkError.
       *
       * @constructor
       * @param {string} [message] - Optional error message.
       */
    constructor (message) {
      super(message);
      this.code = 503;
      this.name = 'NetworkError';
    }
  }

  /**
   * Custom error class for creating specific errors with a custom name and code.
   *
   * @class CustomError
   * @extends {Error}
   */
  class CustomError extends Error {
    /**
       * Creates an instance of CustomError.
       *
       * @constructor
       * @param {string} name - The custom name of the error.
       * @param {number} code - The custom error code.
       * @param {string} [message] - Optional error message.
       */
    constructor (name, code, message) {
      super(message);
      this.code = code;
      this.name = name;
    }
  }

  /**
   * Checks if the provided error is an instance of any Liquid errors.
   *
   * @function
   * @param {Error} error - The error object to check.
   * @returns {boolean} True if the error is a ForbiddenError, UnauthorizedError, or NetworkError; otherwise, false.
   */
  function isLiquidError (error) {
    return error instanceof ForbiddenError || error instanceof UnauthorizedError || error instanceof NetworkError
  }

  const FIVE_MINUTES = 300;

  /**
   * Cache class for storing and retrieving data with an external redis instance.
   *
   * @class
   */
  class Cache {
    /**
       * Creates an instance of the Cache class.
       *
       * @constructor
       * @param {Object} [cacheOptions] - Options for configuring the cache.
       * @param {Object} [cacheOptions.client] - The caching client (e.g., Redis client) to use.
       * @param {number} [cacheOptions.expire] - The expiration time for cached items in seconds.
       */
    constructor (cacheOptions) {
      if (cacheOptions) {
        this.cachePrefix = 'liquid_node_connector:';
        this.cacheClient = cacheOptions.client;
        this.cacheExpiry = cacheOptions.expire || FIVE_MINUTES;
      }
    }

    /**
       * Retrieves data from the cache using the specified key.
       *
       * @async
       * @param {string} key - The key used to retrieve data from the cache.
       * @returns {Promise<Object|null>} The cached data, or null if the cache is not configured.
       */
    async get (key) {
      if (!this.cacheClient) {
        return null
      }
      const cacheResult = await this.cacheClient.get(`${this.cachePrefix}${key}`);
      if (cacheResult) {
        return JSON.parse(cacheResult)
      }
    }

    /**
       * Stores data in the cache with the specified key.
       *
       * @async
       * @param {string} key - The key used to store data in the cache.
       * @param {Object} data - The JSON data to be stored in the cache.
       * @returns {Promise<undefined>} A Promise indicating the completion of the set operation.
       */
    async set (key, data) {
      if (!this.cacheClient) {
        return
      }
      return await this.cacheClient.set(`${this.cachePrefix}${key}`, JSON.stringify(data), 'EX', this.cacheExpiry)
    }
  }

  /**
   * Logger class for handling logging in the Liquid Node Connector.
   *
   * @class
   */
  class Logger {
    /**
       * Creates an instance of the Logger class.
       *
       * @constructor
       * @param {boolean} [debugging=true] - A flag indicating whether debugging is enabled.
       */
    constructor (debugging = true) {
      /**
           * A flag indicating whether debugging is enabled.
           * @type {boolean}
           * @private
           */
      this.debugging = debugging;

      /**
           * The prefix to be added to log messages.
           * @type {string}
           * @private
           */
      this.prefix = '[Liquid Node Connector]';
    }

    /**
       * Logs messages to the console with the "debug" level.
       *
       * @param {...*} args - The messages or values to be logged.
       */
    debug () {
      if (!this.debugging) {
        return
      }
      const args = Array.from(arguments);
      args.unshift(this.prefix);
      console.log.apply(console, args);
    }

    /**
       * Logs messages to the console with the "info" level.
       *
       * @param {...*} args - The messages or values to be logged.
       */
    info () {
      if (!this.debugging) {
        return
      }
      const args = Array.from(arguments);
      args.unshift(this.prefix);
      console.log.apply(console, args);
    }

    /**
       * Logs warning messages to the console with the "warn" level.
       *
       * @param {...*} args - The warning messages or values to be logged.
       */
    warn () {
      if (!this.debugging) {
        return
      }
      const args = Array.from(arguments);
      args.unshift(this.prefix);
      console.warn.apply(console, args);
    }

    /**
      * Logs error messages to the console with the "error" level.
      *
      * @param {...*} args - The error messages or values to be logged.
      */
    error () {
      if (!this.debugging) {
        return
      }
      const args = Array.from(arguments);
      args.unshift(this.prefix);
      console.error.apply(console, args);
    }
  }

  /**
   * @typedef {Object} Scope
   * @property {string} name - The name of the scope.
   * @property {string} description - The description of the scope.
   * @property {string} [parent] - The parent scope's name.
   */

  /**
   * Manages scopes and provides methods for checking if a scope is allowed.
   *
   * @class
   */
  class ScopeManager {
    /**
       * Creates an instance of the ScopeManager class.
       *
       * @constructor
       * @param {string} host - The base URL where the scopes can be fetched.
       */
    constructor (host, logger) {
      /**
           * The base URL where the scopes can be fetched.
           * @type {string}
           * @private
           */
      this.host = host;

      /**
           * The loaded scopes.
           * @type {Object}
           * @private
           */
      this.scopes = {};

      /**
           * The logger.
           * @type {Object}
           * @private
           */
      this.logger = logger;

      this.logger.debug('Initializing scope manager with host: ' + this.host);

      const circuit = new mollitia.Circuit({
        options: {
          modules: [
            new mollitia.Retry({
              attempts: 8,
              interval: 500,
              mode: mollitia.RetryMode.LINEAR,
              factor: 2,
              onRejection: () => true
            })
          ]
        }
      });
      circuit.fn(this.initializeScopes.bind(this)).execute();
    }

    /**
       * Recursively generates a tree structure of scopes.
       *
       * @param {Scope[]} scopes - The array of scopes to process.
       * @param {string|null|undefined} [root=null] - The root scope's name.
       * @returns {Object} The tree structure of scopes.
       * @private
       */
    getScopeTree (scopes, root = null) {
      return Object.fromEntries(
        scopes
          .filter((scope) => scope.parent === root)
          .map((s) => [s.name, this.getScopeTree(scopes, s.name)])
      )
    }

    /**
       * Initializes scopes by fetching them from the server.
       *
       * @private
       */
    async initializeScopes () {
      try {
        const response = await fetch(`${this.host}/user/scopes`);
        if (!response.ok) {
          throw new Error(`Failed to fetch scopes. Status: ${response.status}`)
        }
        this.scopes = (await response.json()).data.scopes;
        this.logger.error('Scopes initialized.');
      } catch (error) {
        this.logger.error('Error initializing scopes:', error.message);
        throw error
      }
    }

    /**
       * Gets all the loaded scopes.
       *
       * @returns {Object} The loaded scopes.
       */
    getScopes () {
      return this.scopes
    }

    /**
       * Checks if a given scope is allowed based on the user's allowed scopes.
       *
       * @param {string} scope - The scope to check.
       * @param {Object} token - The token object.
       * @returns {boolean} True if the scope is allowed, false otherwise.
       */
    checkTokenScope (scope, token = { scope: [] }) {
      if (!this.scopes) {
        this.logger.warn('Scope list not ready');
        return false
      }
      const allowedScopes = token.scope;
      if (this.isScopeAllowed(scope, allowedScopes)) {
        return true
      } else {
        return false
      }
    }

    /**
       * Checks if a given scope is allowed based on a list of allowed scopes.
       *
       * @param {string} scope - The scope to check.
       * @param {string[]} [allowedScopes=[]] - The array of allowed scopes.
       * @returns {boolean} True if the scope is allowed, false otherwise.
       */
    isScopeAllowed (scope, allowedScopes = []) {
      const scopeObject = this.scopes[scope];
      if (!scopeObject) {
        this.logger.warn(`Unknown scope ${scope}. Did you forget to configure this scope in your Liquid server?`);
        return false
      }
      if (allowedScopes.includes(scopeObject.name) || allowedScopes.includes(scopeObject.parent)) {
        return true
      } else if (scopeObject.parent) {
        return this.isScopeAllowed(scopeObject.parent, allowedScopes)
      } else {
        return false
      }
    }
  }

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
      this.clientId = clientId;
      this.clientSecret = clientSecret;
      this.scope = scope;
      if (Array.isArray(this.scope)) {
        this.scope = this.scope.join(',');
      }
      this.host = host;
      this.cache = new Cache(cacheOptions);
      this.logger = new Logger(debugging);
      this.scopeManager = new ScopeManager(this.host, this.logger);
      this.logger.info(
        'Initialized Liquid Node Connector for client ' + clientId
      );
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
        const cacheKey = `token:${token}`;
        const cacheResult = await this.cache.get(cacheKey);
        if (cacheResult) {
          if (cacheResult.ok === 1) {
            return cacheResult.data.tokenInfo
          } else {
            throw new ForbiddenError()
          }
        }
        const api = `${this.host}/oauth/introspect`;
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await this.getAccessToken()).accessToken}`
        };
        const body = JSON.stringify({ token });
        let response;
        try {
          response = await fetch(api, { method: 'POST', headers, body });
        } catch {
          throw new NetworkError()
        }
        const result = await response.json();
        // No need to await. Cache can always be set again if failed.
        this.cache.set(cacheKey, result);
        this.logger.debug(`Cache written for ${cacheKey}`);
        if (response.status !== 200 || !result.ok) {
          throw new ForbiddenError()
        }
        return result.data.tokenInfo
      } catch (error) {
        this.logger.error(error);
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
        const now = new Date();
        if (this.accessTokenExpiry.getTime() <= now.getTime()) {
          const expiry = new Date();
          const api = `${this.host}/oauth/token`;
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
          };
          const body = new URLSearchParams();
          body.append('grant_type', 'client_credentials');
          body.append('client_id', this.clientId);
          body.append('client_secret', this.clientSecret);
          body.append('scope', this.scope);
          let response;
          try {
            response = await fetch(api, { method: 'POST', headers, body });
          } catch {
            throw new NetworkError()
          }
          if (response.status !== 200) {
            throw new UnauthorizedError()
          }
          const result = await response.json();
          this.accessToken = result.access_token;
          expiry.setSeconds(expiry.getSeconds() + result.expires_in);
          this.accessTokenExpiry = expiry;
          this.logger.debug('Access token returned from remote.');
        } else {
          this.logger.debug('Access token returned from memory.');
        }
        return {
          accessToken: this.accessToken,
          accessTokenExpiry: this.accessTokenExpiry
        }
      } catch (error) {
        this.logger.error(error);
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

  return LiquidNodeAuthenticator;

}));
//# sourceMappingURL=index.js.map
