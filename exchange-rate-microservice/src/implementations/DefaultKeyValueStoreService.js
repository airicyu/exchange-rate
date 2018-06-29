'use strict';

const KeyValueStoreService = require('./../interfaces/KeyValueStoreService');
const configService = require('./../services/ConfigServiceProvider.js').getService();
const logService = require('./../services/logServiceProvider.js').getService();

/**
 * Default Key Value Store with in memory map
 *
 * @class DefaultKeyValueStoreService
 * @extends {KeyValueStoreService}
 */
class DefaultKeyValueStoreService extends KeyValueStoreService {

    /**
     *Creates an instance of DefaultKeyValueStoreService.
     * @memberof DefaultKeyValueStoreService
     */
    constructor() {
        super();
        this._store = {};
    }

    /**
     * Get value from store
     *
     * @param {*} key
     * @returns
     * @memberof DefaultKeyValueStoreService
     */
    async get(key) {
        return this._store[key];
    }

    /**
     * Set value to store
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof DefaultKeyValueStoreService
     */
    async set(key, value) {
        this._store[key] = value;
        return;
    }
}

module.exports = DefaultKeyValueStoreService;