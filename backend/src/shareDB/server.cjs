var ShareDB = require('sharedb');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
var MongoClient = require('mongodb').MongoClient;
const ShareDBMongo = require('sharedb-mongo');


var db = new ShareDBMongo('mongodb://localhost:27017/shareDB');
const backend = new ShareDB({ db })
const connection = backend.connect() // Create a ShareDB connection

// Connect any incoming WebSocket connection to ShareDB
var wss = new WebSocket.Server({ port: 5802 }); // Create a WebSocket server
wss.on('connection', function (ws) {
    var stream = new WebSocketJSONStream(ws); // Create a stream
    backend.listen(stream); // Connect the stream to ShareDB
});

console.log('Listening on http://localhost:5802');
