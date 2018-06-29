'use strict';

const events = require('events');

/**
 * Listener to latest data update
 *
 * @class LatestDataUpdateListener
 * @extends {events.EventEmitter}
 */
class LatestDataUpdateListener extends events.EventEmitter {

    /**
     *Creates an instance of LatestDataUpdateListener.
     * @param {*} { subscription }
     * @memberof LatestDataUpdateListener
     */
    constructor({ subscription }) {
        super();
        let self = this;
        self.subscription = subscription;
        self.messageHandler = (message) => {
            message.ack();
            console.log('LatestDataUpdateListener emit update');
            self.emit('update', message);
        };
    }

    /**
     * Start listening
     *
     * @memberof LatestDataUpdateListener
     */
    listen() {
        let self = this;
        self.subscription.on(`message`, self.messageHandler);
    }

    /**
     * Stop listening
     *
     * @memberof LatestDataUpdateListener
     */
    stop() {
        let self = this;
        self.subscription.removeListener('message', self.messageHandler);
    }
}

module.exports = LatestDataUpdateListener;