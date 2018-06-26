'use strict';

const DataService = require('./../interfaces/DataService');
const DataServiceRouteAgent = require('./../interfaces/DataServiceRouteAgent');

const logService = require('./../services/logServiceProvider.js').service;
const serviceProvider = require('./../services/serviceProvider');

const request = require('request');

/**
 * Default implementation
 *
 * @class DefaultDataService
 * @extends {DataService}
 */
class DefaultDataService extends DataService {

    /**
     * query currency latest data
     *
     * @param {*} currency
     * @returns
     * @memberof DefaultDataService
     */
    async queryCurrencyData(currency) {
        
        let queryParams = {currency};
        let dataServiceRouteAgent = serviceProvider.getServiceInstance(DataServiceRouteAgent);
        
        // TODO date timezone handling, now depends on server time
        let nowDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        let dataEndpoint = `${dataServiceRouteAgent.route(queryParams)}/exchangeRates:${currency}-${nowDate}`;

        let dataValue = null;
        try {
            dataValue = await new Promise((resolve, reject) => {
                request({
                    url: dataEndpoint,
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    } else if (body && typeof body === 'object' && body.hasOwnProperty('data')) {
                        return resolve(body.data);
                    } else {
                        return reject(new Error('Unknown data'));
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
     * query currency historical data
     *
     * @param {*} currency
     * @param {*} date
     * @returns
     * @memberof DefaultDataService
     */
    async queryCurrencyHistoricalData(currency, date) {
        
        let queryParams = {currency, date};
        let dataServiceRouteAgent = serviceProvider.getServiceInstance(DataServiceRouteAgent);
        let dataEndpoint = `${dataServiceRouteAgent.route(queryParams)}/exchangeRates:${currency}-${date}`;

        let dataValue = null;
        try {
            dataValue = await new Promise((resolve, reject) => {
                request({
                    url: dataEndpoint,
                    json: true
                }, (error, response, body) => {
                    if (error) {
                        return reject(error);
                    } else if (body && body.data) {
                        return resolve(body.data);
                    } else {
                        return reject(new Error('Unknown data'));
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
}

module.exports = DefaultDataService;
