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
class DelegateConfigService extends ConfigService{
    
    /**
     * getter of config
     *
     * @memberof DelegateConfigService
     */
    get config(){
        return serviceProvider.getServiceInstance(ConfigService).config;
    }

    /**
     * setter of config
     *
     * @memberof DelegateConfigService
     */
    set config(newConfig){
        serviceProvider.getServiceInstance(ConfigService).config = newConfig;
    }
}


/**
 * Config Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class ConfigServiceProvider
 * @extends {ConfigService}
 */
class ConfigServiceProvider extends ConfigService {

    constructor() {
        super();
        serviceProvider.setServiceInstance(ConfigService, new DefaultConfigService());
        this.delegateService = new DelegateConfigService();
    }

    get service(){
        return this.delegateService;
    }
}

const instance = new ConfigServiceProvider();

module.exports = instance;