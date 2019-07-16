'use strict';

const express = require('express');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const PORT_WS = 4000;
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

app.post("/", function(req, res) {
    console.log('echo');
    console.log('Query:' + Object.entries(req.body.queryResult));
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
app.listen(PORT, () => console.log(`Webhook Listening on ${PORT}`))
