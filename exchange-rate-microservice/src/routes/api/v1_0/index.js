'use strict';

const express = require('express');
const router = express.Router();
const exchangeRatesRoutes = require('./exchangeRatesRoutes.js');

const logService = require('./../../../services/logServiceProvider').service;

/**
 * Route exchange rate resources
 */
router.use('/exchangeRates', (req, res, next)=>{
    logService.log(`API v1.0 exchangeRatesRoutes '/exchangeRates', ${req.originalUrl}`);
    next();
}, exchangeRatesRoutes);

router.get('/healthCheck', (req, res)=>{
    res.json({
        error: null,
        data: true
    });
});

module.exports = router;
