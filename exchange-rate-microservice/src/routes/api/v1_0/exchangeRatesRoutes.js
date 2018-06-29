'use strict';

const express = require('express');
const router = express.Router();
const exchangeRatesController = require('./../../../controllers/exchangeRatesController.js');

const logService = require('./../../../services/logServiceProvider').getService();

/**
 * Route query currency latest rate
 */
router.get('/:baseCurrency/latest', (req, res, next) => {
    logService.log(`exchangeRatesRoutes currency latest value, ${req.originalUrl}`);
    next();
}, exchangeRatesController.getCurrencyLatestData);

/**
 * Route query currency historical rate
 */
router.get('/:baseCurrency/historical/:date', (req, res, next) => {
    logService.log(`exchangeRatesRoutes currency historical value, ${req.originalUrl}`);
    next();
}, exchangeRatesController.getCurrencyHistoricalData);

module.exports = router;