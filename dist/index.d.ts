export { LiquidNodeAuthenticator as default };
export type Scope = {
    /**
     * - The name of the scope.
     */
    name: string;
    /**
     * - The description of the scope.
     */
    description: string;
    /**
     * - The parent scope's name.
     */
    parent?: string;
};
/**
 * LiquidNodeAuthenticator provides methods for authenticating and obtaining access tokens
 * from a Liquid OAuth server.
 *
 * @class
 */
declare class LiquidNodeAuthenticator {
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
    constructor({ host, clientId, clientSecret, scope, cacheOptions, debugging }: {
        host: string;
        clientId: string;
        clientSecret: string;
        scope?: (string | string[]);
        cacheOptions?: {
            client?: any;
            expire?: number;
        };
        debugging?: boolean;
    });
    accessToken: any;
    accessTokenExpiry: Date;
    clientId: string;
    clientSecret: string;
    scope: string;
    host: string;
    cache: Cache;
    logger: Logger;
    scopeManager: ScopeManager;
    /**
    * Authenticates a user using the provided token.
    *
    * @async
    * @param {string} token - The authentication token to be validated.
    * @throws {ForbiddenError} If the token is invalid or unauthorized.
    * @throws {NetworkError} If a network error occurs during the authentication process.
    * @returns {Object} The user's token information if authentication is successful.
    */
    authenticate(token: string): any;
    /**
     * Retrieves an access token, either from memory or by making a request to the Liquid instance.
     *
     * @async
     * @throws {NetworkError} If a network error occurs during the access token retrieval.
     * @throws {UnauthorizedError} If the OAuth server returns an unauthorized status.
     * @returns {Object} The access token and its expiration details.
     */
    getAccessToken(): any;
    /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The Express response object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
    checkTokenScope(scope: string, token: any): boolean;
}
/**
 * Cache class for storing and retrieving data with an external redis instance.
 *
 * @class
 */
declare class Cache {
    /**
     * Creates an instance of the Cache class.
     *
     * @constructor
     * @param {Object} [cacheOptions] - Options for configuring the cache.
     * @param {Object} [cacheOptions.client] - The caching client (e.g., Redis client) to use.
     * @param {number} [cacheOptions.expire] - The expiration time for cached items in seconds.
     */
    constructor(cacheOptions?: {
        client?: any;
        expire?: number;
    });
    cachePrefix: string;
    cacheClient: any;
    cacheExpiry: number;
    /**
     * Retrieves data from the cache using the specified key.
     *
     * @async
     * @param {string} key - The key used to retrieve data from the cache.
     * @returns {Promise<Object|null>} The cached data, or null if the cache is not configured.
     */
    get(key: string): Promise<any | null>;
    /**
     * Stores data in the cache with the specified key.
     *
     * @async
     * @param {string} key - The key used to store data in the cache.
     * @param {Object} data - The JSON data to be stored in the cache.
     * @returns {Promise<undefined>} A Promise indicating the completion of the set operation.
     */
    set(key: string, data: any): Promise<undefined>;
}
/**
 * Logger class for handling logging in the Liquid Node Connector.
 *
 * @class
 */
declare class Logger {
    /**
     * Creates an instance of the Logger class.
     *
     * @constructor
     * @param {boolean} [debugging=true] - A flag indicating whether debugging is enabled.
     */
    constructor(debugging?: boolean);
    /**
     * A flag indicating whether debugging is enabled.
     * @type {boolean}
     * @private
     */
    private debugging;
    /**
     * The prefix to be added to log messages.
     * @type {string}
     * @private
     */
    private prefix;
    /**
     * Logs messages to the console with the "debug" level.
     *
     * @param {...*} args - The messages or values to be logged.
     */
    debug(...args: any[]): void;
    /**
     * Logs messages to the console with the "info" level.
     *
     * @param {...*} args - The messages or values to be logged.
     */
    info(...args: any[]): void;
    /**
     * Logs warning messages to the console with the "warn" level.
     *
     * @param {...*} args - The warning messages or values to be logged.
     */
    warn(...args: any[]): void;
    /**
    * Logs error messages to the console with the "error" level.
    *
    * @param {...*} args - The error messages or values to be logged.
    */
    error(...args: any[]): void;
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
declare class ScopeManager {
    /**
     * Creates an instance of the ScopeManager class.
     *
     * @constructor
     * @param {string} host - The base URL where the scopes can be fetched.
     */
    constructor(host: string, logger: any);
    /**
     * The base URL where the scopes can be fetched.
     * @type {string}
     * @private
     */
    private host;
    /**
     * The loaded scopes.
     * @type {Object}
     * @private
     */
    private scopes;
    /**
     * The logger.
     * @type {Object}
     * @private
     */
    private logger;
    /**
     * Recursively generates a tree structure of scopes.
     *
     * @param {Scope[]} scopes - The array of scopes to process.
     * @param {string|null|undefined} [root=null] - The root scope's name.
     * @returns {Object} The tree structure of scopes.
     * @private
     */
    private getScopeTree;
    /**
     * Initializes scopes by fetching them from the server.
     *
     * @private
     */
    private initializeScopes;
    /**
     * Gets all the loaded scopes.
     *
     * @returns {Object} The loaded scopes.
     */
    getScopes(): any;
    /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The token object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
    checkTokenScope(scope: string, token?: any): boolean;
    /**
     * Checks if a given scope is allowed based on a list of allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {string[]} [allowedScopes=[]] - The array of allowed scopes.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
    isScopeAllowed(scope: string, allowedScopes?: string[]): boolean;
}
