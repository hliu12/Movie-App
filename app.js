// var url = require('url');
const { defaultMaxListeners } = require("events");
var fs = require("fs");

// Renders the page based off the path
function renderHTML(path, response) {
  fs.readFile(path, null, function (error, data) {
    if (error) {
      response.writeHead(404);
      response.write("File not found!");
    } else {
      response.write(data);
    }
    response.end();
  });
}

module.exports = {
  handleRequest: function (request, response) {
    response.writeHead(200, {
      "Content-Type": "text/html",
    });

    // Gets the path of the requested file
    // var path = url.parse(request.url).pathname;
    var url = new URL(request.url, "http://localhost:8080");
    var path = url.pathname;

    switch (path) {
      case "/":
        renderHTML("./index.html", response);
        break;
      //   case "/index.html":
      //     renderHTML("./index.html", response);
      //     break;
      case "/login":
        renderHTML("./login.html", response);
        break;
      case "/signup":
        renderHTML("./signup.html", response);
        break;
      case "/watchlist":
        renderHTML("./watchlist.html", response);
        break;
      case "/search":
        renderHTML("./search.html", response);
        break;
      default:
        response.writeHead(404);
        response.write("Route not defined");
        response.end();
    }
  },
};
