'use strict';

const http = require('http');
const express = require('express');
const httpShutdown = require('http-shutdown');

class MockExchangeRateService {

    constructor(options) {
        this.init(options);
    }

    init(options) {
        let self = this;
        self._options = options;
        self._map = options.dataMap;
    }

    async start() {
        let self = this;
        let port = self._options.port;

        let app = express();

        app.get('/api/v1.0/exchangeRates/:currency/latest', (req, res) => {
            res.send({
                error: null,
                data: self._map[req.params.currency].latest
            });
        });

        app.get('/api/v1.0/exchangeRates/:currency/historical/:date', (req, res) => {
            res.send({
                error: null,
                data: self._map[req.params.currency].historical
            });
        });

        let server = http.createServer(app);
        server.listen(port);
        self._server = httpShutdown(server);
        console.log(`Mock Exchange Rate Service started with port ${port}`);
        return;
    }

    async stop() {
        let self = this;
        return new Promise((resolve, reject) => {
            self._server.forceShutdown(() => {
                resolve();
            });
        });
    }
}

module.exports = MockExchangeRate.getService();