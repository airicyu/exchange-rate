'use strict';

const KeyValueStoreService = require('./../interfaces/KeyValueStoreService');
const configService = require('./../services/configServiceProvider.js').getService();
const mysql = require('mysql');
const logService = require('./../services/logServiceProvider.js').getService();

/**
 * MYSQL implementation key-value-store
 * 
 * TODO: allow configurable table/column naming instead of hardcode
 *
 * @class MySqlKeyValueStoreService
 * @extends {KeyValueStoreService}
 */
class MySqlKeyValueStoreService extends KeyValueStoreService {

    /**
     *Creates an instance of MySqlKeyValueStoreService.
     * @memberof MySqlKeyValueStoreService
     */
    constructor() {
        super();
        let self = this;
        let config = configService.config;
        self._pool = mysql.createPool(config.mysql.connectionOptions);
    }

    /**
     * Get value from key-value-store
     *
     * @param {*} key
     * @returns
     * @memberof MySqlKeyValueStoreService
     */
    async get(key) {
        let self = this;
        return new Promise((resolve, reject) => {
            self._pool.getConnection(function (error, connection) {
                if (error) {
                    logService.error('MySQL key value store connection error', error);
                    return reject(error);
                }

                connection.query({ sql: 'SELECT `value` FROM `key_value_store` WHERE `key` = ?', values: [key] }, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        logService.error('MySQL key value store get value error', error);
                        return reject(error);
                    }
                    if (results && results[0] && results[0].value) {
                        return resolve(results[0].value);
                    } else {
                        return resolve(null);
                    }

                });
            });
        });
    }

    /**
     * Set value to key-value-store
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof MySqlKeyValueStoreService
     */
    async set(key, value) {
        let self = this;
        return new Promise((resolve, reject) => {
            self._pool.getConnection(function (error, connection) {
                if (error) {
                    logService.error('MySQL key value store connection error', error);
                    return reject(error);
                }

                connection.query({
                    sql: 'INSERT INTO `key_value_store` (`key`,`value`) VALUES (?, ?) ' +
                        'ON DUPLICATE KEY UPDATE `value`=?',
                    values: [key, value, value]
                }, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        logService.error('MySQL key value store set value error', error);
                        return reject(error);
                    }
                    return resolve(results);

                });
            });
        });
    }
}

module.exports = MySqlKeyValueStoreService;