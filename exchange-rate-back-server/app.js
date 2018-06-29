'use strict';

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountToken.json';

const PubSub = require(`@google-cloud/pubsub`);
const request = require('request');
const QueryLatestDataHandlerProcess = require('./src/QueryLatestDataHandlerProcess');
const BroadcastLatestDataHandler = require('./src/BroadcastLatestDataHandler');

const getLatestDataFromRemoteSourceFunc = async () => {
    //TODO error handling
    return new Promise((resolve) => {
        request({
            url: 'http://localhost:8000/api/v1.0/exchangeRates/usd/latest',
            json: true
        }, (error, response, body) => {
            resolve(body.data);
        });
    });
}

const run = async () => {

    const pubsub = new PubSub();

    const queryLatestDataJobTopicName = 'query-latest-exchange-rate-job';
    const queryLatestDataJobTopicSubName = 'query-latest-exchange-rate-job-sub';

    const queryLatestDataTopic = pubsub.topic(queryLatestDataJobTopicName);
    let queryLatestDataSub = queryLatestDataTopic.subscription(queryLatestDataJobTopicSubName);
    if (!await queryLatestDataSub.exists()[0]) {
        queryLatestDataSub = (await queryLatestDataTopic.createSubscription(queryLatestDataJobTopicSubName))[0];
    }

    const broadcastLatestDataTopicName = 'broadcast-latest-exchange-rate';

    const broadcastLatestDataHandler = new BroadcastLatestDataHandler({ topic: pubsub.topic(broadcastLatestDataTopicName) });
    const queryLatestDataHandlerProcess = new QueryLatestDataHandlerProcess({ subscription: queryLatestDataSub, broadcastDataHandler: broadcastLatestDataHandler, getLatestDataFromRemoteSourceFunc });

    await queryLatestDataHandlerProcess.run();

}

run();