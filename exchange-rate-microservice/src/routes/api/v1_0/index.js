'use strict';

const express = require('express');
const router = express.Router();
const exchangeRatesRoutes = require('./exchangeRatesRoutes.js');

const logService = require('./../../../services/logServiceProvider').getService();

/**
 * Route exchange rate resources
 */
router.use('/exchangeRates', (req, res, next) => {
    next();
}, exchangeRatesRoutes);

/**
 * For health check purpose
 */
router.get('/healthCheck', (req, res) => {
    res.json({
        error: null,
        data: true
    });
});

module.exports = router;