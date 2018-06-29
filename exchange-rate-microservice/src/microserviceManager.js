'use strict';

const http = require('http')
const httpShutdown = require('http-shutdown');
const express = require('express');
const bodyParser = require('body-parser');

const configService = require('./services/configServiceProvider').getService();
const logService = require('./services/logServiceProvider').getService();
const apiRouter = require('./routes/api');


/**
 * Exchange Rate Microservice Manager.
 * It has basic control to the microservice like start/stop.
 *
 * @class ExchangeRateMicroserviceManager
 */
class ExchangeRateMicroserviceManager {

    constructor() {
        let self = this;
        self._app = null;
        self._server = null;
    }

    _inflatExpressApp() {
        let self = this;
        self._app = express();
        let app = self._app;
        app.use(bodyParser.json({
            limit: '1mb'
        }));

        app.use('/', (req, res, next) => {
            logService.log(`app router '*', ${req.originalUrl}`);
            next();
        }, apiRouter);

    }

    /**
     * start the HTTP service
     *
     * @returns
     * @memberof ExchangeRateMicroserviceManager
     */
    async start() {
        let self = this;
        self._inflatExpressApp();

        let server = http.createServer(self._app);
        let port = configService.config.port;
        server.listen(port);
        self._server = httpShutdown(server);

        logService.log(`Exchange Rate Service started with port ${port}`);

        return;
    }

    /**
     * stop the HTTP service
     *
     * @returns
     * @memberof ExchangeRateMicroserviceManager
     */
    async stop() {
        let self = this;
        return new Promise((resolve, reject) => {
            self._server.forceShutdown(() => {
                resolve();
            });
        });
    }
}

module.exports = new ExchangeRateMicroserviceManager();