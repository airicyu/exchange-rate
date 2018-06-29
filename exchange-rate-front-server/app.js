'use strict';

process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountToken.json';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PubSub = require('@google-cloud/pubsub');
const LatestDataUpdateListener = require('./src/LatestDataUpdateListener');
const QueryLatestDataJobSubmitter = require('./src/QueryLatestDataJobSubmitter');
const uuidv4 = require('uuid/v4');
const request = require('request');
const http = require('http');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({
    limit: '1mb',
    extended: true
}));

/**
 * Ajax endpoint for query exchange rate historical data
 */
app.post('/exchangeRate/historical', async (req, res) => {
    let queryDate = req.body.queryDate;
    if (queryDate && typeof queryDate === 'string' && queryDate.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
        let data = await new Promise((resolve) => {
            request({
                url: `http://exchange-rate-microservice.airic-yu.com/api/v1.0/exchangeRates/usd/historical/${queryDate}`,
                json: true
            }, (error, response, body) => {
                resolve(body.data);
            });
        });
        return res.json(data);
    }
    return res.sendStatus(400);
});

/**
 * Home service webpage
 */
app.get('/', (req, res) => {
    res.render('index');
});

// start HTTP server
const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Front Server App listening on port ${PORT}`);
});

//web socket server for server push latest exchange rate query result to frontend
const run = async () => {
    let subsciprionName = 'sub-' + uuidv4();

    const pubsub = PubSub();
    const submitJobTopicName = 'query-latest-exchange-rate-job';

    /*
        The submitter for publish query job to backend through pub/sub
    */
    let queryLatestDataJobSubmitter = new QueryLatestDataJobSubmitter({ topic: pubsub.topic(submitJobTopicName) });

    /*
        Listen to latest exchange rate update by pub/sub subscription
    */
    let listenLatestDataUpdateTopicName = 'broadcast-latest-exchange-rate';
    let topic = pubsub.topic(listenLatestDataUpdateTopicName);
    let topicExist = (await topic.exists())[0];
    if (!topicExist) {
        await pubsub.createTopic(listenLatestDataUpdateTopicName);
        topic = pubsub.topic(listenLatestDataUpdateTopicName)
    }
    let subscription = (await topic.createSubscription(subsciprionName))[0];
    let latestDataUpdateListener = new LatestDataUpdateListener({ subscription });
    latestDataUpdateListener.listen();

    let port2 = process.env.PORT2 || 23311;
    let socketServer = express().listen(port2, () => {
        console.log(`Web socket server has started and is listening on port ${port2}.`);
    });

    //start web socket server
    require('./src/webSocketServer')({ httpServer: socketServer, queryLatestDataJobSubmitter, latestDataUpdateListener });
};

run();

module.exports = app;