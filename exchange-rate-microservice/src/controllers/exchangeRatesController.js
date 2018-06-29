'use strict'

/*
This file is the controller for exchange rates business function
*/

const dataService = require('./../services/dataServiceProvider').getService();
const logService = require('./../services/logServiceProvider').getService();

//main controller
const exchangeRatesController = {};

/**
 * currency latest data query handler
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exchangeRatesController.getCurrencyLatestData = async (req, res) => {

    // input validation
    let baseCurrency = req.params.baseCurrency;
    if (!baseCurrency || !/^[a-z]*$/.test("" + baseCurrency)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }

    // query data from data service
    let { error, data } = await dataService.queryCurrencyLatestData(baseCurrency);

    // response
    if (error) {
        logService.log('Data Service Error: ', error);
        return res.json({
            error: 'Service Error',
            data: null
        });
    } else {
        return res.json({
            error: null,
            data: data
        });
    }
}

/**
 * currency historical data query handler
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exchangeRatesController.getCurrencyHistoricalData = async (req, res) => {

    let baseCurrency = req.params.baseCurrency;
    let date = req.params.date;

    // input validation
    if (!baseCurrency || !/^[a-z]*$/.test("" + baseCurrency)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }
    if (!date || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test("" + date)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }

    // query data from data service
    let { error, data } = await dataService.queryCurrencyHistoricalData(baseCurrency, date);

    // response
    if (error) {
        logService.log('Data Service Error: ', error);
        return res.json({
            error: 'Service Error',
            data: null
        });
    } else {
        return res.json({
            error: null,
            data: data
        });
    }
}

module.exports = exchangeRatesController;