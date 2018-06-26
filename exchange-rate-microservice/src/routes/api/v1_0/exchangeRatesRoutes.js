'use strict';

const express = require('express');
const router = express.Router();
const exchangeRatesController = require('./../../../controllers/exchangeRatesController.js');

const logService = require('./../../../services/logServiceProvider').service;

/**
 * Route query currency latest rate
 */
router.get('/:currency/latest', (req, res, next)=>{
    logService.log(`exchangeRatesRoutes currency latest value '/:currency/latest', ${req.originalUrl}`);
    next();
}, exchangeRatesController.currencyLatestData);

/**
 * Route query currency historical rate
 */
router.get('/:currency/historical/:date', (req, res, next)=>{
    logService.log(`exchangeRatesRoutes currency historical value '/:currency/historical/:date', ${req.originalUrl}`);
    next();
}, exchangeRatesController.currencyHistoricalData);

module.exports = router;