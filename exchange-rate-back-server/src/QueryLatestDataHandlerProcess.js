'use strict';

class QueryLatestDataHandlerProcess {
    constructor({
        subscription,
        broadcastDataHandler,
        getLatestDataFromRemoteSourceFunc
    }) {
        let self = this;
        self.messagesBuffer = [];
        self.subscription = subscription;
        self.broadcastDataHandler = broadcastDataHandler;
        self.getLatestDataFromRemoteSourceFunc = getLatestDataFromRemoteSourceFunc;
    }

    async run() {
        let self = this;
        self.messagesBuffer = [];
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`\tData: ${message.data}`);
            console.log(`\tAttributes: ${message.attributes}`);
            self.messagesBuffer.push(message);
            message.ack();
        };
        self.subscription.on(`message`, messageHandler);

        //trigger query API once with minimum 5 second interval
        while (true) {
            await sleep(1000);
            if (self.messagesBuffer.length > 0) {
                self.messagesBuffer = [];
                let latestData = await self.getLatestDataFromRemoteSourceFunc();
                await self.broadcastDataHandler.broadcast(Buffer.from(JSON.stringify(latestData)));
            }
        }

    }
   
}

const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


module.exports = QueryLatestDataHandlerProcess;