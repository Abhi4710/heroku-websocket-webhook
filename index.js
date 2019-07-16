'use strict';

const res_dict = {"hello": "Hi", "name":"Abhi", "server":"websocket", "hi": "hello", "version": "1.0",  '{"state":"ON"}': {"query": "cmd", "state": "on"}, '{"state":"OFF"}': {"query": "cmd", "state": "off"}}

const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const server = express();

const PORT = process.env.PORT || 3000;

server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

server.use(bodyParser.json());

server.post("/", function(req, res) {
  console.log('Query:' + Object.entries(req.body.queryResult.queryText));
  console.log('Param ' + Object.entries(req.body.queryResult.parameters));
  var n = req.body.queryResult.queryText;
  
  if (n.includes("what") or n.includes('What')) {
//     res = {"query": "?"}
//     myfunction(res);
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

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//     let res = res_dict[message]
//     // ws.send(res);
//     if (message == '{"state":"ON"}'){
//       res = res_dict['{"state":"ON"}']
//     }
//     if (message == '{"state":"OFF"}'){
//       res = res_dict['{"state":"OFF"}']
//     }
//     if (message != ''){
//     myfunction(res)
//     };
//   });
  ws.on('close', () => console.log('Client disconnected'));
});

function myfunction(res) {
  wss.clients.forEach((client) => {
    client.send(JSON.stringify(res))
      .then(client.on('message', function incoming(message) {
      console.log(message);
    });
  // console.log(client.send('1234'));
  });
};
