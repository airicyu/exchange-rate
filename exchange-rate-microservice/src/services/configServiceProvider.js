'use strict';

const ConfigService = require('../interfaces/ConfigService');
const DefaultConfigService = require('./../implementations/DefaultConfigService');
const serviceProvider = require('./serviceProvider');

/**
 * Delegate Config Service
 *
 * @class DelegateConfigService
 * @extends {ConfigService}
 */
class DelegateConfigService extends ConfigService {

    constructor(strategyName) {
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }

    /**
     * getter of config
     *
     * @memberof DelegateConfigService
     */
    get config() {
        return serviceProvider.getServiceInstance(ConfigService, this.delegateStrategyName).config;
    }

    /**
     * setter of config
     *
     * @memberof DelegateConfigService
     */
    set config(newConfig) {
        serviceProvider.getServiceInstance(ConfigService, this.delegateStrategyName).config = newConfig;
    }
}


/**
 * Config Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class ConfigServiceProvider
 * @extends {ConfigService}
 */
class ConfigServiceProvider {

    /**
     *Creates an instance of ConfigServiceProvider.
     * @memberof ConfigServiceProvider
     */
    constructor() {
        serviceProvider.registerServiceInstance(ConfigService, new DefaultConfigService());
        this.delegateServiceInstanceMap = {};
    }

    /**
     * Get service instance
     *
     * @param {*} strategyName
     * @returns
     * @memberof ConfigServiceProvider
     */
    getService(strategyName) {
        if (this.delegateServiceInstanceMap[strategyName]) {
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateConfigService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new ConfigServiceProvider();

module.exports = instance;