'use strict';

class QueryLatestDataJobSubmitter {
    constructor({topic}) {
        this.topic = topic;
    }

    submit(jobMessage) {
        let self = this;
        self.topic
            .publisher()
            .publish(jobMessage)
            .then(messageId => {
                console.log(`Message ${messageId} published.`);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}

module.exports = QueryLatestDataJobSubmitter;