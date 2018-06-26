'use strict';

const DataServiceRouteAgent = require('./../interfaces/DataServiceRouteAgent');
const DataService = require('../interfaces/DataService');
const DefaultDataServiceRouteAgent = require('./../implementations/DefaultDataServiceRouteAgent');
const DefaultDataService = require('./../implementations/DefaultDataService');
const serviceProvider = require('./serviceProvider');

/**
 * Delegate Data Service
 *
 * @class DelegateDataService
 * @extends {DataService}
 */
class DelegateDataService extends DataService {
    
    async queryCurrencyData(currency) {
        return serviceProvider.getServiceInstance(DataService).queryCurrencyData(currency);
    }

    async queryCurrencyHistoricalData(currency, date) {
        return serviceProvider.getServiceInstance(DataService).queryCurrencyHistoricalData(currency, date);
    }
}

/**
 * Data Service Provider.
 * Expose the delegate service to all other codes while decouple concrete instance.
 *
 * @class DataServiceProvider
 * @extends {DataService}
 */
class DataServiceProvider extends DataService {

    constructor() {
        super();
        serviceProvider.setServiceInstance(DataService, new DefaultDataService());
        serviceProvider.setServiceInstance(DataServiceRouteAgent, new DefaultDataServiceRouteAgent());
        this.delegateService = new DelegateDataService();
    }


    /**
     * getter of service
     *
     * @readonly
     * @memberof DataServiceProvider
     */
    get service(){
        return this.delegateService;
    }
}

const instance = new DataServiceProvider();

module.exports = instance;