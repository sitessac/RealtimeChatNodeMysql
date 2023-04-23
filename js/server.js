// creating express instance
var express = require("express");
var app = express();
 
// creating http instance
var http = require("http").createServer(app);
 
// creating socket io instance
var io = require("socket.io")(http);
 
// start the server
http.listen(3000, function () {
    console.log("Server started");
});
