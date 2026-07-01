import Retry from './retry'
import { LoggerInterface } from './logger.js'

export interface Scope {
  name: string;
  description: string;
  parent?: string | null;
}

/**
 * Manages scopes and provides methods for checking if a scope is allowed.
 *
 * @class
 */
class ScopeManager {
  host: string;
  scopes: Record<string, Scope>;
  logger: LoggerInterface | any;

  /**
   * @constructor
   * @param {string} host - The base URL where the scopes can be fetched.
   */
  constructor (host: string, logger: LoggerInterface | any) {
    this.host = host
    this.scopes = {}
    this.logger = logger

    this.logger.debug('Initializing scope manager with host: ' + this.host)

    const retry = new Retry({
      attempts: 10,
      interval: 500,
      mode: 'linear',
      factor: 2,
      onRejection: () => true
    })

    retry.execute(this.initializeScopes.bind(this))
  }

  /**
     * Recursively generates a tree structure of scopes.
     *
     * @param {Scope[]} scopes - The array of scopes to process.
     * @param {string|null|undefined} [root=null] - The root scope's name.
     * @returns {Object} The tree structure of scopes.
     * @private
     */
  getScopeTree (scopes: Scope[], root: string | null = null): any {
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
  async initializeScopes (): Promise<void> {
    try {
      const response = await fetch(`${this.host}/user/scopes`)
      if (!response.ok) {
        throw new Error(`Failed to fetch scopes. Status: ${response.status}`)
      }
      this.scopes = (await response.json()).data.scopes
      this.logger.error('Scopes initialized.')
    } catch (error: any) {
      this.logger.error('Error initializing scopes:', error.message)
      throw error
    }
  }

  /**
     * Gets all the loaded scopes.
     *
     * @returns {Object} The loaded scopes.
     */
  getScopes (): Record<string, Scope> {
    return this.scopes
  }

  /**
     * Checks if a given scope is allowed based on the user's allowed scopes.
     *
     * @param {string} scope - The scope to check.
     * @param {Object} token - The token object.
     * @returns {boolean} True if the scope is allowed, false otherwise.
     */
  checkTokenScope (scope: string, token: any = { scope: [] }): boolean {
    if (!this.scopes) {
      this.logger.warn('Scope list not ready')
      return false
    }
    const allowedScopes = token.scope
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
  isScopeAllowed (scope: string, allowedScopes: string[] = []): boolean {
    const scopeObject = this.scopes[scope]
    if (!scopeObject) {
      this.logger.warn(`Unknown scope ${scope}. Did you forget to configure this scope in your Liquid server?`)
      return false
    }
    if (allowedScopes.includes(scopeObject.name) || (scopeObject.parent && allowedScopes.includes(scopeObject.parent))) {
      return true
    } else if (scopeObject.parent) {
      return this.isScopeAllowed(scopeObject.parent, allowedScopes)
    } else {
      return false
    }
  }
}

export default ScopeManager
