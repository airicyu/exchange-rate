'use strict';

const MockDataService = require('./src/mockDataService.js');
const MockExchangeRateService = require('./src/MockExchangeRateService.js');

{
    let dataMap = {};
    dataMap['exchangeRates:usd-' + new Date().toISOString().slice(0, 10).replace(/-/g, '')] = 1234;
    dataMap['exchangeRates:usd-' + new Date(Date.now()-86400*1000).toISOString().slice(0, 10).replace(/-/g, '')] = 1000;
    let mockDataService = new MockDataService({
        port: 9000,
        dataMap
    });
    mockDataService.start();
}

{
    let mockExchangeRateService = new MockExchangeRateService({
        port: 9100,
        dataMap: {
            'usd': {
                'latest': 7.78,
                'historical': 8.00
            }
        }
    });
    mockExchangeRateService.start();
}

module.exports = {
    MockDataService,
    MockExchangeRateService
}