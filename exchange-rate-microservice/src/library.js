'use strict';

const interfaces = {
    ConfigService: require('./interfaces/ConfigService.js'),
    DataService: require('./interfaces/DataService.js'),
    LogService: require('./interfaces/LogService.js'),
}

const serviceProvider = require('./services/serviceProvider');
const microserviceManager = require('./microserviceManager');

const library = {
    api: {
        getServiceProvider: null,
        start: null,
        stop: null
    },
    interfaces
}

library.api.getServiceProvider = () => {
    return serviceProvider;
}

library.api.start = async () => {
    return microserviceManager.start();
}

library.api.stop = async () => {
    return microserviceManager.stop();
}

module.exports = library;