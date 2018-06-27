'use strict';

const KeyValueStoreService = require('./../interfaces/KeyValueStoreService');
const configService = require('./../services/ConfigServiceProvider.js').getService();
const logService = require('./../services/logServiceProvider.js').getService();

//TODO using real key value store
class DefaultKeyValueStoreService extends KeyValueStoreService {

    constructor(){
        super();
        this._store = {};
    }

    async get(key) {
        return this._store[key];
    }

    async set(key, value) {
        this._store[key] = value;
        return;
    }
}

module.exports = DefaultKeyValueStoreService;
