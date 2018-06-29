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
class DelegateLogService extends LogService {

    /**
     *Creates an instance of DelegateLogService.
     * @param {*} strategyName
     * @memberof DelegateLogService
     */
    constructor(strategyName) {
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }

    /**
     * log message
     *
     * @param {*} args
     * @returns
     * @memberof DelegateLogService
     */
    log(...args) {
        let service = serviceProvider.getServiceInstance(LogService, this.delegateStrategyName);
        return service.log(...args);
    }

    /**
     * log debug message
     *
     * @param {*} args
     * @returns
     * @memberof DelegateLogService
     */
    debug(...args) {
        let service = serviceProvider.getServiceInstance(LogService, this.delegateStrategyName);
        return service.debug(...args);
    }


    /**
     * log error message
     *
     * @param {*} args
     * @returns
     * @memberof DelegateLogService
     */
    error(...args) {
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


    /**
     * Get service instance
     *
     * @param {*} strategyName
     * @returns
     * @memberof LogServiceProvider
     */
    getService(strategyName) {
        if (this.delegateServiceInstanceMap[strategyName]) {
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateLogService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new LogServiceProvider();

module.exports = instance;