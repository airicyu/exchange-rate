'use strict';

const YAML = require('yamljs');
const library = require('./library.js');

const configService = require('./services/configServiceProvider').service;

const run = async ()=>{

    //TODO read config from env variables
    let config = YAML.load('./config.yaml');

    configService.config = config;

    await library.api.start();
}

run();