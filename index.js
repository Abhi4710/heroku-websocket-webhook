'use strict';

// const res_dict = {"hello": "Hi", "name":"Abhi", "server":"websocket", "hi": "hello", "version": "1.0",  '{"state":"ON"}': {"query": "cmd", "state": "on"}, '{"state":"OFF"}': {"query": "cmd", "state": "off"}}

const express = require('express');
const server = express();
const bodyParser = require("body-parser");
const SocketServer = require('ws').Server;
const expressWs = require('express-ws')(server);
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');

const PORT = process.env.PORT || 3000;


// var server = express().use((req, res) => res.sendFile(INDEX) );

// app.ws('/', function(ws, req) {
//   ws.on('message', function(msg) {
//     console.log(msg);
//   });
//   console.log('socket', req.testing);
// });
var connect = function(){
  const wss = new SocketServer({server})
//   console.log(wss);
  wss.on('connection', function connection(ws) {
    console.log('Client connected');
  ws.on('message', function incoming(message) {
    console.log('received: %s', message)});
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
};
server.use(
  bodyParser.urlencoded({
    extended: true
  })
).use(bodyParser.json());

server.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// server.ws('/', function(ws, req) {
//   ws.on('connection', function(msg) {
//     console.log('connected');
//   });
//   ws.on('message', function(msg) {
//     console.log(msg);
//   });
//   ws.on('close', function(msg) {
//     console.log('client disconnected');
//   });
// //   console.log('socket', req.testing);
// });
// server.use(wss)

// server.use(bodyParser.json());

server.post("/echo", function(req, res) {
  console.log('Query:' + Object.entries(req.body.queryResult.queryText));
  console.log('Param ' + Object.entries(req.body.queryResult.parameters));
  var n = req.body.queryResult.queryText;
  
  if (n.includes("what")) {
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
// connect();
server.use((req, res) => res.sendFile(INDEX) ).listen(PORT, () => console.log(`Listening on ${ PORT }`));
connect();
// console.log('server started');
// server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// const wss = new SocketServer({ server });

// function myfunction(res) {
//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify(res))
//       .then(client.on('message', function incoming(message) {
//       console.log(message);
//     }));
//   // console.log(client.send('1234'));
//   });
// };
