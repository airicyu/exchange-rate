'use strict';

const LogService = require('../interfaces/LogService');
const DefaultLogService = require('./../implementations/DefaultLogService');
const serviceProvider = require('./serviceProvider');

/**
 * Delegate Log Service
 *
 * @class DelegateLogService
 * @extends {LogService}
 */
class DelegateLogService extends LogService{
    log(...args){
        let service = serviceProvider.getServiceInstance(LogService);
        return service.log(...args);
    }
}

/**
 * Log Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class LogServiceProvider
 * @extends {LogService}
 */
class LogServiceProvider extends LogService {

    constructor() {
        super();
        serviceProvider.setServiceInstance(LogService, new DefaultLogService());
        this.delegateService = new DelegateLogService();
    }

    /**
     * getter of service
     *
     * @readonly
     * @memberof LogServiceProvider
     */
    get service(){
        return this.delegateService;
    }
}

const instance = new LogServiceProvider();

module.exports = instance;
