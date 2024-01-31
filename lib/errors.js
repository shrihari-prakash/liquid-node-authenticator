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
    constructor(message) {
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
    constructor(message) {
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
    constructor(message) {
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
    constructor(name, code, message) {
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
function isLiquidError(error) {
    return error instanceof ForbiddenError || error instanceof UnauthorizedError || error instanceof NetworkError;
}

export { ForbiddenError, UnauthorizedError, NetworkError, CustomError, isLiquidError };
