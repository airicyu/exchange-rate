'use strict';

const express = require('express');
const router = express.Router();
const v1 = require('./v1_0');

const logService = require('./../../services/logServiceProvider').getService();

/**
 * Route API v1.0
 */
router.use('/api/v1.0', (req, res, next) => {
    next();
}, v1);

module.exports = router;