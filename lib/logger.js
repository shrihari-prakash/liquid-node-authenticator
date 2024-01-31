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
    constructor(debugging = true) {
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
        this.prefix = "[Liquid Node Connector]";
    }

    /**
     * Logs messages to the console with the "debug" level.
     *
     * @param {...*} args - The messages or values to be logged.
     */
    debug() {
        if (!this.debugging) {
            return;
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
    info() {
        if (!this.debugging) {
            return;
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
    warn() {
        if (!this.debugging) {
            return;
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
    error() {
        if (!this.debugging) {
            return;
        }
        const args = Array.from(arguments);
        args.unshift(this.prefix);
        console.error.apply(console, args);
    }
}

export default Logger;
