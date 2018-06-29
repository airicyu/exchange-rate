'use strict';

/**
 * Broadcast the latest data update
 *
 * @class BroadcastLatestDataHandler
 */
class BroadcastLatestDataHandler {
    constructor({ topic }) {
        this.topic = topic;
    }

    /**
     * Broadcast the latest data update to all subscriptions
     * @param {*} latestDataMessage 
     */
    broadcast(latestDataMessage) {
        let self = this;
        self.topic
            .publisher()
            .publish(latestDataMessage)
            .then(messageId => {
                console.log(`Message ${messageId} published.`);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}

module.exports = BroadcastLatestDataHandler;