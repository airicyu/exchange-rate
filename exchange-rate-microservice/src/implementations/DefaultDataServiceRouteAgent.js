'use strict';

const DataServiceRouteAgent = require('./../interfaces/DataServiceRouteAgent');

const configService = require('./../services/configServiceProvider').service;

/**
 * Default data service route agent. Support single route or multiple instance random route
 *
 * @class DefaultDataServiceRouteAgent
 * @extends {DataServiceRouteAgent}
 */
class DefaultDataServiceRouteAgent extends DataServiceRouteAgent{
    
    route(queryParams){
        let dataServiceBaseEndpoint = configService.config.dataServiceBaseEndpoint;
        // single route
        if (typeof dataServiceBaseEndpoint === 'string'){
            return `${dataServiceBaseEndpoint}/data`;
        } else if (Array.isArray(dataServiceBaseEndpoint)) {
            // single route
            if (dataServiceBaseEndpoint.length===1){
                return `${dataServiceBaseEndpoint[0]}/data`;
            } else { // single route
                let randomIndex = parseInt(Math.floor(Math.random()*dataServiceBaseEndpoint.length),10) % dataServiceBaseEndpoint.length;
                return `${dataServiceBaseEndpoint[randomIndex]}/data`;    
            }
        }
    }
}

module.exports = DefaultDataServiceRouteAgent;
