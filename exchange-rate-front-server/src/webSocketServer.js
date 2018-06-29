'use strict';
/*
Reference: https://github.com/theturtle32/WebSocket-Node
*/

const WebSocketServer = require('websocket').server;

module.exports = ({ httpServer, queryLatestDataJobSubmitter, latestDataUpdateListener }) => {

    let wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        // put logic here to detect whether the specified origin is allowed.
        return true;
    }

    let acceptedConnectionsMap = new Map();

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log((new Date()) + ' Connection accepted.');

        acceptedConnectionsMap.set(connection, connection);

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                if (message.utf8Data.indexOf('request update') === 0) {
                    let jobMessage = Buffer.from(message.utf8Data);
                    queryLatestDataJobSubmitter.submit(jobMessage);
                }
                //connection.sendUTF(message.utf8Data);
            } else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            acceptedConnectionsMap.delete(connection);
        });
    });

    latestDataUpdateListener.on('update', (event) => {
        console.log('receive update event', event);
        let data = JSON.parse(event.data && event.data.toString());
        let pushMessage = JSON.stringify({
            serverTime : Date.now(),
            data: data
        });
        if (pushMessage) {
            let connections = [...acceptedConnectionsMap.keys()];
            for (let connection of connections) {
                try {
                    connection.send(pushMessage);
                } catch (e) {
                    console.error(e);
                }
            }
        }
    });
};