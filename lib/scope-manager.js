import { Circuit, Retry, RetryMode } from 'mollitia';

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
    constructor(host, logger) {
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

        this.logger.debug("Initializing scope manager with host: " + this.host);

        const circuit = new Circuit({
            options: {
                modules: [
                    new Retry({
                        attempts: 8,
                        interval: 500,
                        mode: RetryMode.LINEAR,
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
    getScopeTree(scopes, root = null) {
        return Object.fromEntries(
            scopes
                .filter((scope) => scope.parent == root)
                .map((s) => [s.name, this.getScopeTree(scopes, s.name)])
        );
    }

    /**
     * Initializes scopes by fetching them from the server.
     *
     * @private
     */
    async initializeScopes() {
        try {
            const response = await fetch(`${this.host}/user/scopes`);
            if (!response.ok) {
                throw new Error(`Failed to fetch scopes. Status: ${response.status}`);
            }
            this.scopes = (await response.json()).data.scopes;
            this.logger.error("Scopes initialized.");
        } catch (error) {
            this.logger.error("Error initializing scopes:", error.message);
            throw error;
        }
    }

    /**
     * Gets all the loaded scopes.
     *
     * @returns {Object} The loaded scopes.
     */
    getScopes() {
        return this.scopes;
    }

    /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The token object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
    checkTokenScope(scope, token = { scope: [] }) {
        if (!this.scopes) {
            this.logger.warn("Scope list not ready");
            return false;
        }
        const allowedScopes = token.scope;
        if (this.isScopeAllowed(scope, allowedScopes)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if a given scope is allowed based on a list of allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {string[]} [allowedScopes=[]] - The array of allowed scopes.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
    isScopeAllowed(scope, allowedScopes = []) {
        const scopeObject = this.scopes[scope];
        if (!scopeObject) {
            this.logger.warn(`Unknown scope ${scope}. Did you forget to configure this scope in your Liquid server?`);
            return false;
        }
        if (allowedScopes.includes(scopeObject.name) || allowedScopes.includes(scopeObject.parent)) {
            return true;
        } else if (scopeObject.parent) {
            return this.isScopeAllowed(scopeObject.parent, allowedScopes);
        } else {
            return false;
        }
    }
}

export default ScopeManager;
