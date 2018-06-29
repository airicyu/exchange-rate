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

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({
    limit: '1mb',
    extended: true
}));

app.get('/test', (req, res) => {
    res.send('test');
});

app.post('/exchangeRate/historical', async (req, res) => {
    let queryDate = req.body.queryDate;
    if (queryDate && typeof queryDate === 'string' && queryDate.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
        let data = await new Promise((resolve) => {
            request({
                url: `http://localhost:8000/api/v1.0/exchangeRates/usd/historical/${queryDate}`,
                json: true
            }, (error, response, body) => {
                resolve(body.data);
            });
        });
        return res.json(data);
    }
    return res.sendStatus(400);
});

app.get('/', (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Front Server App listening on port ${PORT}`);
});

const run = async () => {
    let subsciprionName = 'sub-' + uuidv4();

    const pubsub = PubSub();
    const submitJobTopicName = 'query-latest-exchange-rate-job';

    let queryLatestDataJobSubmitter = new QueryLatestDataJobSubmitter({ topic: pubsub.topic(submitJobTopicName) });

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

    require('./src/webSocketServer')({ httpServer, queryLatestDataJobSubmitter, latestDataUpdateListener });
};

run();

module.exports = app;