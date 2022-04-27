// Actual server file, requires app.js
var http = require("http");
var app = require("./app");

http.createServer(app.handleRequest).listen(8080);
