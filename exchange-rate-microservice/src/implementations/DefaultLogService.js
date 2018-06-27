'use strict';

const LogService = require('./../interfaces/LogService');

class DefaultLogService extends LogService {

    log(...args){
        // TODO replace with winston logger
        return console.log.apply(console, args);
    }

    debug(...args){
        // TODO replace with winston logger
        return console.debug.apply(console, args);
    }

    error(...args){
        // TODO replace with winston logger
        return console.error.apply(console, args);
    }
}

module.exports = DefaultLogService;
