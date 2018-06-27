'use strict';

const MockDataService = require('./src/mockDataService.js');
const MockExchangeRateService = require('./src/MockExchangeRateService.js');

{
    let dataMap = {
        'usd': {
            'latest': {'hkd': 7.78},
            'historical': {'hkd': 7.77}
        }
    };
    let mockDataService = new MockDataService({
        port: 9000,
        dataMap
    });
    mockDataService.start();
}

/*{
    let mockExchangeRateService = new MockExchangeRateService({
        port: 8000,
        dataMap: {
            'usd': {
                'latest': 7.78,
                'historical': 8.00
            }
        }
    });
    mockExchangeRateService.start();
}*/

module.exports = {
    MockDataService,
    MockExchangeRateService
}