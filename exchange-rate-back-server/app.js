'use strict';

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountToken.json';

const PubSub = require(`@google-cloud/pubsub`);
const request = require('request');
const QueryLatestDataHandlerProcess = require('./src/QueryLatestDataHandlerProcess');
const BroadcastLatestDataHandler = require('./src/BroadcastLatestDataHandler');

const run = async () => {

    const pubsub = new PubSub();

    /*
    Subsript latest exchange rate query job topic
    */
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

    /*
    Background process to
    - fetch query job from subscription,
    - and then query data and publish
    */
    await queryLatestDataHandlerProcess.run();

}

/**
 * Get Latest Exchange Rate from microservice
 *
 * @returns
 */
const getLatestDataFromRemoteSourceFunc = async () => {
    //TODO error handling
    return new Promise((resolve) => {
        request({
            //TODO endpoint not hardcoded
            url: 'http://exchange-rate-microservice.airic-yu.com/api/v1.0/exchangeRates/usd/latest' || 'http://localhost:8000/api/v1.0/exchangeRates/usd/latest',
            json: true
        }, (error, response, body) => {
            console.error('Error when getting latest data from remote source', error);
            resolve(body.data);
        });
    });
}

run();