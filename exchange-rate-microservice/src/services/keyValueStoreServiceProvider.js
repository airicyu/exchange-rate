'use strict';

const KeyValueStoreService = require('../interfaces/KeyValueStoreService');
const DefaultKeyValueStoreService = require('./../implementations/DefaultKeyValueStoreService');
const serviceProvider = require('./serviceProvider');

class DelegateKeyValueStoreService extends KeyValueStoreService {
    
    constructor(strategyName){
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }

    async get(key) {
        return serviceProvider.getServiceInstance(KeyValueStoreService, this.delegateStrategyName).get(key);
    }

    async set(key, value) {
        return serviceProvider.getServiceInstance(KeyValueStoreService, this.delegateStrategyName).set(key, value);
    }
}

class KeyValueStoreServiceProvider {

    constructor() {
        serviceProvider.registerServiceInstance(KeyValueStoreService, new DefaultKeyValueStoreService());
        this.delegateServiceInstanceMap = {};
    }

    getService(strategyName){
        if (this.delegateServiceInstanceMap[strategyName]){
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateKeyValueStoreService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new KeyValueStoreServiceProvider();

module.exports = instance;