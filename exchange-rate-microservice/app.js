'use strict';

const YAML = require('yamljs');

const serviceProvider = require('./src/services/serviceProvider');
const configService = require('./src/services/configServiceProvider').getService();
const KeyValueStoreService = require('./src/interfaces/KeyValueStoreService');
const MySqlKeyValueStoreService = require('./src/implementations/MySqlKeyValueStoreService');

const library = require('./src/library.js'); //main library

const run = async () => {

    //TODO read config from env variables
    let config = YAML.load('./config.yaml');

    configService.config = config;

    //inject service implmentation
    serviceProvider.registerServiceInstance(KeyValueStoreService, new MySqlKeyValueStoreService());

    await library.api.start();
}

run();