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
    
   setInterval(function(){if (g_query == '?') {ws.send("?");}
                         else if (g_query.includes('CMD')) {ws.send(g_query);}}, 1000);
});

function myfunction(query, resp) {
    if (resp != '...'){g_resp = resp;}
    console.log(g_resp);
    g_query = query;
    console.log(g_query);
    if (resp == '"heartbeat":"keepalive"') { return 'server: ok';}
    else if (resp == '"astate":"ON"' || resp == '"astate":"OFF"') { return 'aack';}
    else if (resp == '"qstate":"ON"' || resp == '"qstate":"OFF"') { return 'qack';}
    else {return 'command not recognised'}
};

server.post("/echo", function (req, res) {
    console.log('echo');
    console.log(req.body.queryResult);
    var q_text = req.body.queryResult.queryText;
    if (q_text.includes("what")) {
        myfunction("?", '...')
        var speech = 'It is currently ' + g_resp;

    }
    else {
          myfunction('CMD:' + req.body.queryResult.parameters.state, '...')
        
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
