'use strict';

const should = require('chai').should;
const expect = require('chai').expect;
const request = require('request');

const library = require('./../src/library');

describe('Test service lifecycle', function () {
    this.timeout(3000);

    it("Test start service", function () {

        return new Promise(async (resolve, reject) => {
            try {
                //TODO read config from env variables
                let config = {
                    port: 9001
                };

                let configService = require('./../src/services/configServiceProvider').getService();
                configService.config = config;

                await library.api.start();

                await new Promise(_ => {
                    request({
                        url: 'http://localhost:9001/api/v1.0/healthCheck',
                        json: true
                    }, (error, response, body) => {
                        expect(body).to.eqls({ error: null, data: true });
                        _();
                    });
                });

            } catch (e) {
                console.error(e);
            } finally {
                await library.api.stop();
                return resolve();
            }
        });
    });

    it("Test stop service", function () {

        return new Promise(async (resolve) => {
            try {
                //TODO read config from env variables
                let config = {
                    port: 9002
                };

                let configService = require('./../src/services/configServiceProvider');
                configService.config = config;

                await library.api.start();
                await library.api.stop();

                await new Promise(_ => {
                    request({
                        url: 'http://localhost:9001/api/v1.0/healthCheck',
                        json: true
                    }, (error, response, body) => {
                        expect(error).to.be.not.null;
                        expect(error.code).to.equal('ECONNREFUSED');
                        _();
                    });
                });

                return resolve();
            } catch (e) {
                console.error(e);
            } finally {
                await library.api.stop();
                return resolve();
            }
        });
    });

});