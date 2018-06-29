'use strict';

/**
 * Log Service Interface
 *
 * @class LogService
 */
class LogService {

    /**
     * Log message
     *
     * @param {*} args
     * @memberof LogService
     */
    log(...args) {}

    /**
     * Log debug message
     *
     * @param {*} args
     * @memberof LogService
     */
    debug(...args) {}

    /**
     * Log error message
     *
     * @param {*} args
     * @memberof LogService
     */
    error(...args) {}
}

module.exports = LogService;