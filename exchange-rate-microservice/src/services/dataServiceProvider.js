'use strict';

const DataService = require('../interfaces/DataService');
const DefaultDataService = require('./../implementations/DefaultDataService');
const serviceProvider = require('./serviceProvider');

/**
 * Delegate Data Service
 *
 * @class DelegateDataService
 * @extends {DataService}
 */
class DelegateDataService extends DataService {
    
    constructor(strategyName){
        super();
        let self = this;
        self.delegateStrategyName = strategyName;
    }

    async queryCurrencyLatestData(currency) {
        return serviceProvider.getServiceInstance(DataService, this.delegateStrategyName).queryCurrencyLatestData(currency);
    }

    async queryCurrencyHistoricalData(currency, date) {
        return serviceProvider.getServiceInstance(DataService, this.delegateStrategyName).queryCurrencyHistoricalData(currency, date);
    }
}

/**
 * Data Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class DataServiceProvider
 * @extends {DataService}
 */
class DataServiceProvider {

    constructor() {
        serviceProvider.registerServiceInstance(DataService, new DefaultDataService());
        this.delegateServiceInstanceMap = {};
    }

    getService(strategyName){
        if (this.delegateServiceInstanceMap[strategyName]){
            return this.delegateServiceInstanceMap[strategyName];
        } else {
            this.delegateServiceInstanceMap[strategyName] = new DelegateDataService(strategyName);
            return this.delegateServiceInstanceMap[strategyName];
        }
    }
}

const instance = new DataServiceProvider();

module.exports = instance;