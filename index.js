'use strict';

const express = require('express');
// const express1 = require('express');
const PORT = process.env.PORT || 3000;
const PORT_WH = 4000;
const server = express().use((req, res) => res.sendFile(INDEX)).listen(PORT, () => console.log(`Websocket Listening on ${PORT}`));
const app = express();
const SocketServer = require('ws').Server;
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');


const wss = new SocketServer({ server })

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    });
    ws.on('close', () => console.log('Client disconnected'));
});

app.post("/echo", function(req, res) {
    console.log('Query:' + Object.entries(req.body.queryResult.queryText));
    console.log('Param ' + Object.entries(req.body.queryResult.parameters));
    var n = req.body.queryResult.queryText;
    
    if (n.includes("what")) {
      var speech = 'Please wait checking device - ' + req.body.queryResult.parameters.device;}
    else{
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
app.listen(PORT_WH, () => console.log(`Webhook Listening on ${PORT_WH}`))
