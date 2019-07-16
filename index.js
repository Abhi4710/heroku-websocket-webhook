'use strict';

const express = require('express');
const ws_server = express();
const SocketServer = require('ws').Server;
const path = require('path');

const INDEX = path.join(__dirname, 'index.html');

const PORT = process.env.PORT || 3000;

ws_server.use((req, res) => res.sendFile(INDEX)).listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new SocketServer({ws_server})

wss.on('connection', function connection(ws) {
    console.log('Client connected');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message)
    });
    ws.on('close', () => console.log('Client disconnected'));
});
