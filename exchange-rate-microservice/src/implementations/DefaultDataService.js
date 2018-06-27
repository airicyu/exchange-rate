'use strict';

const DataService = require('./../interfaces/DataService');
const configService = require('./../services/ConfigServiceProvider.js').getService();
const logService = require('./../services/logServiceProvider.js').getService();
const keyValueStoreService = require('./../services/keyValueStoreServiceProvider.js').getService();
const request = require('request');

const exchngeRatesApiResponseBodyParser = (body) => {
    if (body && typeof body === 'object' && body.hasOwnProperty('rates')) {
        return { error: null, data: body.rates };
    } else {
        return { error: new Error('Unknown data'), data: null };
    }
}

/**
 * Default implementation
 *
 * @class DefaultDataService
 * @extends {DataService}
 */
class DefaultDataService extends DataService {

    async fetchLatestCurrencyDataFromSource(baseCurrency) {
        let config = configService.config;
        let openExchangeRatesContext = {
            baseUrl: config.openExchangeRates.baseUrl,
            appId: config.openExchangeRates.appId
        }

        let dataEndpoint = `${openExchangeRatesContext.baseUrl}/api/latest.json?app_id=${openExchangeRatesContext.appId}&base=${baseCurrency}`;

        let dataValue = null;
        try {
            dataValue = await new Promise((resolve, reject) => {
                request({
                    url: dataEndpoint,
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    } else {
                        let { error, data } = exchngeRatesApiResponseBodyParser(body);
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(data);
                        }

                    }
                });
            });
        } catch (error) {
            logService.log('Data Service Error: ', error);
            return {
                error: error,
                data: null
            }
        }

        return {
            error: null,
            data: dataValue
        };
    }

    async fetchHistoricalCurrencyDataFromSource(baseCurrency, date) {
        let config = configService.config;
        let openExchangeRatesContext = {
            baseUrl: config.openExchangeRates.baseUrl,
            appId: config.openExchangeRates.appId
        }

        let dataEndpoint = `${openExchangeRatesContext.baseUrl}/api/historical/${date}.json?app_id=${openExchangeRatesContext.appId}&base=${baseCurrency}`;

        let dataValue = null;
        try {
            dataValue = await new Promise((resolve, reject) => {
                request({
                    url: dataEndpoint,
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    } else {
                        let { error, data } = exchngeRatesApiResponseBodyParser(body);
                        if (error) {
                            return reject(error);
                        } else {
                            return resolve(data);
                        }
                    }
                });
            });
        } catch (error) {
            logService.log('Data Service Error: ', error);
            return {
                error: error,
                data: null
            }
        }

        return {
            error: null,
            data: dataValue
        };
    }

    /**
     * query currency latest data
     *
     * @param {*} baseCurrency
     * @returns
     * @memberof DefaultDataService
     */
    async queryCurrencyLatestData(baseCurrency) {
        let self = this;
        let data = null;
        let error = null;

        //TODO input validation
        let dataKey = `currencyRates:${baseCurrency}:latest`;
        let storeData = await keyValueStoreService.get(dataKey);
        let currencyDataLastSyncTime = await keyValueStoreService.get('_latestCurrencyDataLastUpdateTime');
        if (!storeData || !currencyDataLastSyncTime || Date.now() - currencyDataLastSyncTime > 5 * 60 * 1000) { //5 minute refresh
            //refresh data
            let now = Date.now();
            let result = await self.fetchLatestCurrencyDataFromSource(baseCurrency);
            error = result.error;
            data = result.data;

            if (!error && data) {
                keyValueStoreService.set(dataKey, JSON.stringify(data));
                keyValueStoreService.set('_latestCurrencyDataLastUpdateTime', now);
            }

        } else {
            //get from store
            data = JSON.parse(storeData);
        }

        if (!error && !data) {
            error = new Error('No data available!');
        }

        return { error, data };
    }

    /**
     * query currency historical data
     *
     * @param {*} baseCurrency
     * @param {*} date
     * @returns
     * @memberof DefaultDataService
     */
    async queryCurrencyHistoricalData(baseCurrency, date) {
        let self = this;
        let data = null;
        let error = null;

        //TODO input validation
        let dataKey = `currencyRates:${baseCurrency}:${date}`;
        let storeData = await keyValueStoreService.get(dataKey);
        if (!storeData) { //5 minute refresh
            //refresh data
            let result = await self.fetchHistoricalCurrencyDataFromSource(baseCurrency, date);
            error = result.error;
            data = result.data;

            if (!error && data) {
                keyValueStoreService.set(dataKey, JSON.stringify(data));
            }

        } else {
            //get from store
            data = JSON.parse(storeData);
        }

        if (!error && !data) {
            error = new Error('No data available!');
        }

        return { error, data };
        
    }
}

module.exports = DefaultDataService;