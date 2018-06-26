'use strict';

/**
 * Service Provider.
 * This class store the runtime service to instance mapping.
 * This is for service abstraction purpose.
 *
 * @class ServiceProvider
 */
class ServiceProvider {

    constructor() {
        let self = this;
        self._store = {};
        self._store.services = new Map();
    }

    /**
     * Inject service instance
     *
     * @param {*} serviceInterface
     * @param {*} service
     * @memberof ServiceProvider
     */
    setServiceInstance(serviceInterface, service) {
        let self = this;
        
        if (service instanceof serviceInterface) {
            self._store.services.set(serviceInterface, service);
        }
    }

    /**
     * Runtime get service instance for a service interface
     *
     * @param {*} serviceInterface
     * @returns
     * @memberof ServiceProvider
     */
    getServiceInstance(serviceInterface){
        return this._store.services.get(serviceInterface);
    }
}

const instance = new ServiceProvider();

module.exports = instance;