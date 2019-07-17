'use strict';

const express = require('express');
const PORT = process.env.PORT || 4001;
const server = express();
const bodyParser = require("body-parser");
const expressWs = require('express-ws')(server);

var g_query = '';
var g_resp = '';

var location = "";
var state = "";
var device = "";


const path = require('path');
const INDEX = path.join(__dirname, 'index.html');

server.use(
    bodyParser.urlencoded({
        extended: true
    })
);

server.use(bodyParser.json());

 
server.ws('/', function(ws, req) {
  ws.on('connect', () => console.log('client connected'));   
  ws.on('message', function(msg) {
    ws.send(myfunction('...', msg));
      console.log('g_resp' + g_resp);
   });
});

function myfunction(query, resp) {
    g_resp = resp;
    console.log(g_resp);
    g_query = query;
    console.log(g_query);
    if (resp == '"heartbeat":"keepalive"') { return 'server: ok';}
    else if (resp == '"state": "ON"' || resp == '"state": "OFF"') { return 'act';}
    else {return 'command not recognised'}
};

server.post("/echo", function (req, res) {
    console.log('echo');
    console.log(req.body.queryResult);
    var q_text = req.body.queryResult.queryText;
    if (q_text.includes("what")) {
        myfunction("?", '...')

        var speech = 'Please wait checking device - add variable here'

    }
    else {
          myfunction('CMD', '...')
        
        var speech =
            req.body.queryResult &&
                req.body.queryResult.parameters
                ? "It is turned " + req.body.queryResult.parameters.state : "Seems like some problem. Speak again.";
    }


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
        data: speechResponse,
        fulfillmentText: "Sample text response",
        speech: speech,
        displayText: speech,
        source: "webhook-echo-sample"
    });
});
server.use((req, res) => res.sendFile(INDEX)).listen(PORT, () => console.log(`webhook Listening on ${PORT}`))
