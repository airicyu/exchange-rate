'use strict';

/**
 * Key Value Store Service Interface
 *
 * @class DataService
 */
class KeyValueStoreService {

    /**
     * Get value from key-value-store
     *
     * @param {*} key
     * @memberof KeyValueStoreService
     */
    async get(key) {}

    /**
     * Set value to key-value-store
     *
     * @param {*} key
     * @param {*} value
     * @memberof KeyValueStoreService
     */
    async set(key, value) {}
}

module.exports = KeyValueStoreService;