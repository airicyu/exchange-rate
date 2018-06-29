'use strict';

/**
 * Query Latest exchange rate job submitter.
 * 
 * We would pass a topic to this submitter for submitting job
 *
 * @class QueryLatestDataJobSubmitter
 */
class QueryLatestDataJobSubmitter {

    constructor({ topic }) {
        this.topic = topic;
    }

    /**
     * Submit job
     *
     * @param {*} jobMessage
     * @memberof QueryLatestDataJobSubmitter
     */
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