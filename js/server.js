// creating express instance
var express = require("express");
var app = express();
 
// creating http instance
var http = require("http").createServer(app);
 
// creating socket io instance
var io = require("socket.io")(http);
 
// start the server
http.listen(6000, function () {
    console.log("Server started");
});


io.on("connection", function (socket) {
    console.log("User connected", socket.id);
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
});

// listen from client inside IO "connection" event
socket.on("send_message", function (data) {
    // send event to receiver
    var socketId = users[data.receiver];
 
    io.to(socketId).emit("new_message", data);
});
