'use strict';

const express = require('express');
// const express1 = require('express');
// const PORT_WS = process.env.PORT_WS || 3001;
//const PORT = 3000;
const PORT = process.env.PORT || 4001;
// const server = express().use((req, res) => res.sendFile(INDEX)).listen(PORT_WS, () => console.log(`websocket Listening on ${PORT_WS}`));
const server = express();
const bodyParser = require("body-parser");
const expressWs = require('express-ws')(server);
// const SocketServer = require('ws').Server;
var resp = '';
var query = '';
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');

server.use(
    bodyParser.urlencoded({
        extended: true
    })
);

server.use(bodyParser.json());


server.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
    console.log('next function');
  return next();
});
 
server.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});
 
server.ws('/', function(ws, req) {
  ws.on('connect', () => console.log('client connected'));   
  ws.on('message', function(msg) {
    ws.send('ok ' + msg);
    console.log(msg);
      if (msg != '"heartbeat":"keepalive"') {
        resp = msg;
      }
   });
  setInterval(function(){ if (query != '') {ws.send(query);
                                           query = '';}
                        else {console.log('NO QUERY');}}, 3000);
  console.log('socket', req.testing);
});

function myfunction(resp) {
    wsInstance.getWss().clients.forEach((client) => {
        client.send(JSON.stringify(qtext));
        // console.log(client.send('1234'));
    });
};

server.post("/echo", function (req, res) {
    console.log('echo');
    console.log(req.body.queryResult);
    var q_text = req.body.queryResult.queryText;
    if (q_text.includes("what")) {
        query = '?';
        var speech = 'Please wait checking device - ' + req.body.queryResult.parameters.device;
        if (resp != '') {
            var speech = resp;
        };
    }
    else {
        query = 'CMD';
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
server.use((req, res) => res.sendFile(INDEX)).listen(PORT, () => console.log(`webhook Listening on ${PORT}`))
