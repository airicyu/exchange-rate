'use strict';

const ConfigService = require('./../interfaces/ConfigService');

/**
 * Default implementation with simple object store
 *
 * @class DefaultConfigService
 * @extends {ConfigService}
 */
class DefaultConfigService extends ConfigService {

    /**
     *Creates an instance of DefaultConfigService.
     * @param {*} config
     * @memberof DefaultConfigService
     */
    constructor(config) {
        super(config);
        this._config = config || {};
    }

    /**
     * Get Config
     *
     * @memberof DefaultConfigService
     */
    get config() {
        return this._config;
    }

    /**
     * Set Config
     *
     * @memberof DefaultConfigService
     */
    set config(newConfig) {
        this._config = newConfig;
    }
}

module.exports = DefaultConfigService;