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

    constructor(strategyName){
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }

    log(...args){
        let service = serviceProvider.getServiceInstance(LogService, this.delegateStrategyName);
        return service.log(...args);
    }

    debug(...args){
        let service = serviceProvider.getServiceInstance(LogService, this.delegateStrategyName);
        return service.debug(...args);
    }

    error(...args){
        let service = serviceProvider.getServiceInstance(LogService, this.delegateStrategyName);
        return service.error(...args);
    }
}

/**
 * Log Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class LogServiceProvider
 * @extends {LogService}
 */
class LogServiceProvider {

    constructor() {
        serviceProvider.registerServiceInstance(LogService, new DefaultLogService());
        this.delegateServiceInstanceMap = {};
    }

    getService(strategyName){
        if (this.delegateServiceInstanceMap[strategyName]){
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateLogService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new LogServiceProvider();

module.exports = instance;
