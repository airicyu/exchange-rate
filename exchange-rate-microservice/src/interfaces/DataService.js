'use strict';

/**
 * Exchange Rate Data Service
 *
 * @class DataService
 */
class DataService {

    /**
     * Query currency exchange rate latest data
     *
     * @param {*} currency
     * @memberof DataService
     */
    async queryCurrencyLatestData(currency) {}

    /**
     * Query currency exchange rate historical data
     *
     * @param {*} currency
     * @param {*} date
     * @memberof DataService
     */
    async queryCurrencyHistoricalData(currency, date) {}
}

module.exports = DataService;