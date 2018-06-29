'use strict';

/**
 * Service Provider.
 * This class store the runtime service to instance mapping.
 *
 * @class ServiceProvider
 */
class ServiceProvider {

    /**
     *Creates an instance of ServiceProvider.
     * @memberof ServiceProvider
     */
    constructor() {
        let self = this;
        self._store = {};
        self._store.services = new Map();
    }

    /**
     * Get default strategy name
     *
     * @readonly
     * @static
     * @memberof ServiceProvider
     */
    static get defaultStrategyName() {
        return '__DefaultStrategy';
    }


    /**
     * Register Service Implementation Instance
     *
     * @param {*} serviceInterface
     * @param {*} service
     * @param {*} strategyName
     * @memberof ServiceProvider
     */
    registerServiceInstance(serviceInterface, service, strategyName) {
        let self = this;

        if (service instanceof serviceInterface) {
            let serviceEntries = self._store.services.get(serviceInterface);
            if (!serviceEntries) {
                self._store.services.set(serviceInterface, []);
                serviceEntries = self._store.services.get(serviceInterface);
            }

            strategyName = strategyName || ServiceProvider.defaultStrategyName;
            if (!serviceEntries.map(_ => _.strategyName).includes(strategyName)) {
                serviceEntries.unshift({ strategyName, service });
            } else {
                let entry = serviceEntries.find(_ => _.strategyName === strategyName);
                entry.service = service;
            }
        }
    }

    /**
     * Get service instance for a service interface
     *
     * @param {*} serviceInterface
     * @returns
     * @memberof ServiceProvider
     */
    getServiceInstance(serviceInterface, strategyName) {
        let serviceEntries = this._store.services.get(serviceInterface);
        if (serviceEntries) {
            if (strategyName) {
                return serviceEntries.find(_ => _.strategyName === strategyName).service;
            } else if (serviceEntries.length > 0) {
                return serviceEntries[0].service;
            }
        }
        return null;
    }
}

const instance = new ServiceProvider();

module.exports = instance;