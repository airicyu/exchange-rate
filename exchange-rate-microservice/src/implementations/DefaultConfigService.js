'use strict';

const ConfigService = require('./../interfaces/ConfigService');

/**
 * Default implementation
 *
 * @class DefaultConfigService
 * @extends {ConfigService}
 */
class DefaultConfigService extends ConfigService {
    constructor(config){
        super(config);
        this._config = config || {};
    }

    get config(){
        return this._config;
    }

    set config(newConfig){
        this._config = newConfig;
    }
}

module.exports = DefaultConfigService;
