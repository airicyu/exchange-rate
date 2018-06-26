'use strict';

const LogService = require('./../interfaces/LogService');

class DefaultLogService extends LogService {

    log(...args){
        // TODO replace with winston logger
        return console.log.apply(console, args);
    }
}

module.exports = DefaultLogService;
