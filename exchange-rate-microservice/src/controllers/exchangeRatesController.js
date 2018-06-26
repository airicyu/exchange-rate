'use strict'

/*
This file is the controller for exchange rates business function
*/

const dataService = require('./../services/dataServiceProvider').service;
const logService = require('./../services/logServiceProvider').service;

const exchangeRatesController = {};

/**
 * currency latest data query handler
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exchangeRatesController.currencyLatestData = async (req, res) => {
    // input validation
    let currency = req.params.currency;
    if (!currency || !/^[a-z]*$/.test("" + currency)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }

    // query data from data service
    let { error, data } = await dataService.queryCurrencyData(currency);

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
exchangeRatesController.currencyHistoricalData = async (req, res) => {

    let currency = req.params.currency;
    let date = req.params.date;
    date = date.replace(/-/g, '');

    // input validation
    if (!currency || !/^[a-z]*$/.test("" + currency)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }
    if (!date || !/^[0-9]{8}$/.test("" + date)) {
        return res.json({
            error: 'Invalid request',
            data: null
        });
    }

    // query data from data service
    let { error, data } = await dataService.queryCurrencyHistoricalData(currency, date);

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