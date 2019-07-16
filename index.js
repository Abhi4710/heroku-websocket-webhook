'use strict';

const express = require('express');
// const express1 = require('express');
// const PORT_WS = process.env.PORT_WS || 3001;
//const PORT = 3000;
const PORT_WH = process.env.PORT_WH || 4001;
// const server = express().use((req, res) => res.sendFile(INDEX)).listen(PORT_WS, () => console.log(`websocket Listening on ${PORT_WS}`));
const server = express();
const bodyParser = require("body-parser");
const SocketServer = require('ws').Server;
var resp = '';
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');

server.use(
    bodyParser.urlencoded({
        extended: true
    })
);

server.use(bodyParser.json());


function myfunction(resp) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(resp));
        // console.log(client.send('1234'));
    });
};

server.post("/echo", function (req, res) {
    console.log('echo');
    console.log(req.body.queryResult);
    resp = req.body.queryResult;
    myfunction(resp);
    // console.log('Query:' + Object.entries(req.body.queryResult.queryText));
    // console.log('Param ' + Object.entries(req.body.queryResult.parameters));
    var n = req.body.queryResult.queryText;

    if (n.includes("what")) {
        var speech = 'Please wait checking device - ' + req.body.queryResult.parameters.device;
    }
    else {
        var speech =
            req.body.queryResult &&
                req.body.queryResult.parameters
                ? "It is turned " + req.body.queryResult.parameters.state : "Seems like some problem. Speak again.";
    }

    var req_d = Object.entries(req);

    var speechResponse = {
        google: {
            expectUserResponse: true,
            richResponse: {
                items: [
                    {
                        simpleResponse: {
                            textToSpeech: speech
                        }
                    }
                ]
            }
        }
    };

    return res.json({
        payload: speechResponse,
        //data: speechResponse,
        fulfillmentText: "Sample text response",
        speech: speech,
        displayText: speech,
        source: "webhook-echo-sample"
    });
});
server.use((req, res) => res.sendFile(INDEX)).listen(PORT_WH, () => console.log(`webhook Listening on ${PORT_WH}`))
const wss = new SocketServer({ server })

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    });
    ws.on('close', () => console.log('Client disconnected'));
});
