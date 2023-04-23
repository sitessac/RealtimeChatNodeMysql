// creating express instance
var express = require("express");
var app = express();
 
// creating http instance
var http = require("http").createServer(app);
 
// creating socket io instance
var io = require("socket.io")(http);

// create body parser instance
var bodyParser = require("body-parser");

// enable URL encoded for POST requests
app.use(bodyParser.urlencoded());

// Create instance of mysql
var mysql = require("mysql");

// make a connection
var connection = mysql.createConnection({
    "host": "localhost",
    "user": "root",
    "password": "",
    "database": "web_chat"
});

// connect
connection.connect(function (error) {
    // show error if any
});

// enable headers required for POST request
app.use(function (request, result, next) {
    result.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// create api to return all messages
app.post("/get_messages", function (request, result) {
    // get all messages from database
    connection.query("SELECT * FROM messages WHERE (sender = '" + request.body.sender + "' AND receiver = '" + request.body.receiver + "') OR (sender = '" + request.body.receiver + "' AND receiver = '" + request.body.sender + "')", function (error, messages) {
        // response will be in JSON
        result.end(JSON.stringify(messages));
    });
});

var users = [];

io.on("connection", function (socket) {
    console.log("User connected", socket.id);
 
    // attach incoming listener for new user
    socket.on("user_connected", function (username) {
        // save in array
        users[username] = socket.id;
 
        // socket ID will be used to send message to individual person
 
        // notify all connected clients
        io.emit("user_connected", username);
    });
    
     // listen from client inside IO "connection" event
     socket.on("send_message", function (data) {
       // send event to receiver
       var socketId = users[data.receiver];
 
      io.to(socketId).emit("new_message", data);

      // save in database
      connection.query("INSERT INTO messages (sender, receiver, message) VALUES ('" + data.sender + "', '" + data.receiver + "', '" + data.message + "')", function (error, result) {
           //
      });
   });
}); 


// start the server
http.listen(6000, function () {
    console.log("Server started");
});
