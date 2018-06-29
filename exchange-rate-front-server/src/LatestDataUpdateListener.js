'use strict';

const events = require('events');

class LatestDataUpdateListener extends events.EventEmitter{
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

    listen() {
        let self = this;
        self.subscription.on(`message`, self.messageHandler);
    }

    stop() {
        let self = this;
        self.subscription.removeListener('message', self.messageHandler);
    }
}

module.exports = LatestDataUpdateListener;