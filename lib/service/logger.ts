export interface LoggerInterface {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  [key: string]: any;
}

/**
 * Logger class for handling logging in the Liquid Node Connector.
 *
 * @class
 */
class Logger implements LoggerInterface {
  debugging: boolean
  prefix: string

  /**
     * Creates an instance of Logger.
     *
     * @constructor
     * @param {boolean} [debugging=false] - Specifies if logs should be printed to console.
     */
  constructor (debugging: boolean = false) {
    this.debugging = debugging
    this.prefix = '[Liquid Node Connector] : '
  }

  /**
     * Logs messages to the console with the "debug" level.
     *
     * @param {...any} args - The messages or values to be logged.
     */
  debug (...args: any[]) {
    if (!this.debugging) {
      return
    }
    console.log(this.prefix, ...args)
  }

  /**
     * Logs messages to the console with the "info" level.
     *
     * @param {...any} args - The messages or values to be logged.
     */
  info (...args: any[]) {
    if (!this.debugging) {
      return
    }
    console.log(this.prefix, ...args)
  }

  /**
     * Logs warning messages to the console with the "warn" level.
     *
     * @param {...any} args - The warning messages or values to be logged.
     */
  warn (...args: any[]) {
    if (!this.debugging) {
      return
    }
    console.warn(this.prefix, ...args)
  }

  /**
    * Logs error messages to the console with the "error" level.
    *
    * @param {...any} args - The error messages or values to be logged.
    */
  error (...args: any[]) {
    if (!this.debugging) {
      return
    }
    console.error(this.prefix, ...args)
  }
}

export default Logger
