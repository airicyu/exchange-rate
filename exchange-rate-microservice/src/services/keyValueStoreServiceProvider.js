'use strict';

const KeyValueStoreService = require('../interfaces/KeyValueStoreService');
const DefaultKeyValueStoreService = require('./../implementations/DefaultKeyValueStoreService');
const serviceProvider = require('./serviceProvider');

/**
 * Delegate Key Value Store Service
 *
 * @class DelegateKeyValueStoreService
 * @extends {KeyValueStoreService}
 */
class DelegateKeyValueStoreService extends KeyValueStoreService {

    constructor(strategyName) {
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }


    /**
     * get value from store
     *
     * @param {*} key
     * @returns
     * @memberof DelegateKeyValueStoreService
     */
    async get(key) {
        return serviceProvider.getServiceInstance(KeyValueStoreService, this.delegateStrategyName).get(key);
    }

    /**
     * set value to store
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof DelegateKeyValueStoreService
     */
    async set(key, value) {
        return serviceProvider.getServiceInstance(KeyValueStoreService, this.delegateStrategyName).set(key, value);
    }
}

/**
 * Key Value Store Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class KeyValueStoreServiceProvider
 */
class KeyValueStoreServiceProvider {

    /**
     *Creates an instance of KeyValueStoreServiceProvider.
     * @memberof KeyValueStoreServiceProvider
     */
    constructor() {
        serviceProvider.registerServiceInstance(KeyValueStoreService, new DefaultKeyValueStoreService());
        this.delegateServiceInstanceMap = {};
    }

    /**
     * Get service instance
     *
     * @param {*} strategyName
     * @returns
     * @memberof KeyValueStoreServiceProvider
     */
    getService(strategyName) {
        if (this.delegateServiceInstanceMap[strategyName]) {
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateKeyValueStoreService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new KeyValueStoreServiceProvider();

module.exports = instance;