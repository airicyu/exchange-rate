'use strict';

/**
 * Query latest exchange rate data process
 * 
 * TODO checking subscription queue interval is minimum 1 second (hardcoded). Should make it configuable.
 *
 * @class QueryLatestDataHandlerProcess
 */
class QueryLatestDataHandlerProcess {

    /**
     *Creates an instance of QueryLatestDataHandlerProcess.
     * @param {*} {
     *         subscription,
     *         broadcastDataHandler,
     *         getLatestDataFromRemoteSourceFunc
     *     }
     * @memberof QueryLatestDataHandlerProcess
     */
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

    /**
     * run
     *
     * @memberof QueryLatestDataHandlerProcess
     */
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

        //trigger query API once with minimum 1 second interval
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

/**
 * Helper function for sleeping
 *
 * @param {*} ms
 * @returns
 */
const sleep = async (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = QueryLatestDataHandlerProcess;