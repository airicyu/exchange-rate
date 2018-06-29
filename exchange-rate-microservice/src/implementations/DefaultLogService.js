'use strict';

const LogService = require('./../interfaces/LogService');

/**
 * Default Log service implmenetation with console log
 * 
 * TODO: replace with winston logger
 *
 * @class DefaultLogService
 * @extends {LogService}
 */
class DefaultLogService extends LogService {

    /**
     * Log info message
     *
     * @param {*} args
     * @returns
     * @memberof DefaultLogService
     */
    log(...args) {
        return console.log.apply(console, args);
    }

    /**
     * Log debug message
     *
     * @param {*} args
     * @returns
     * @memberof DefaultLogService
     */
    debug(...args) {
        return console.debug.apply(console, args);
    }

    /**
     * Log error message
     *
     * @param {*} args
     * @returns
     * @memberof DefaultLogService
     */
    error(...args) {
        return console.error.apply(console, args);
    }
}

module.exports = DefaultLogService;