'use strict';

/**
 * Service Provider.
 * This class store the runtime service to instance mapping.
 *
 * @class ServiceProvider
 */
class ServiceProvider {

    constructor() {
        let self = this;
        self._store = {};
        self._store.services = new Map();
    }

    static get defaultStrategyName(){
        return '__DefaultStrategy';
    }

    registerServiceInstance(serviceInterface, service, strategyName) {
        let self = this;
        
        if (service instanceof serviceInterface) {
            let serviceEntries = self._store.services.get(serviceInterface);
            if (!serviceEntries){
                self._store.services.set(serviceInterface, []);
                serviceEntries = self._store.services.get(serviceInterface);
            }
            
            strategyName = strategyName || ServiceProvider.defaultStrategyName;
            if (!serviceEntries.map(_=>_.strategyName).includes(strategyName)){
                serviceEntries.push({strategyName, service});
            } else {
                let entry = serviceEntries.find(_=>_.strategyName === strategyName);
                entry.service = service;
            }
        }
    }

    /**
     * Runtime get service instance for a service interface
     *
     * @param {*} serviceInterface
     * @returns
     * @memberof ServiceProvider
     */
    getServiceInstance(serviceInterface, strategyName){
        strategyName = strategyName || ServiceProvider.defaultStrategyName;
        let serviceEntries = this._store.services.get(serviceInterface);
        if (serviceEntries) {
            return serviceEntries.find(_=>_.strategyName === strategyName).service;
        }
        return null;
    }
}

const instance = new ServiceProvider();

module.exports = instance;