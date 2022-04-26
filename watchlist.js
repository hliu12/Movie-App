const http = require('http');
const url = require('url');
const https = require('https');
const eventHandler = require('events');

var watchlist = [];

// const MongoClient = require('mongodb').MongoClient;
// const mongoURL = "mongodb+srv://sliu17:passwordcs20@cs20.zhfqr.mongodb.net/finalprojectyasss?retryWrites=true&w=majority";

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var pageReq = req.url;
    // Update the pageReq variable to focus on the path section
    if ( (qmark = pageReq.indexOf('?')) > 0)
        pageReq = req.url.substr(0, qmark);
    // If the page is freshly loaded, show the user the input form
    if (pageReq == "/") {
        printForm(res);
    }
    else if (pageReq == "/process") {
        // Check what type of input they entered
        var params = new URLSearchParams(req.url);
        var inputType = params.get("type");
        // Get the user's input
        var qobj = url.parse(req.url, true).query;
        var uinput = qobj.input;
        // Search for the user's input in the database
        searchAPI(res, uinput);
    }
}).listen(8080);

function printForm(res) {
    form = "<form method='get' action = '/process'>";
    form += "Favorite actor: <input type = 'text' name = 'input'><br>";
    form += "<br><input type = 'submit'>"; 
    res.write(form);
}

function searchAPI(myRes, query) {
    const api_url = "https://omdbapi.com/?apikey=4c3128ae&s=" + query;
    https.get(api_url, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            data = JSON.parse(data);
            // console.log(data);
            printResults(myRes, data.Search);
        })
    }).on('error', err => {
        console.log("Error: " + err.message);
  })
}

function printResults(res, movies) {
    for (i = 0; i < movies.length; i++) {
        div = "<div id=" + i + ">";
        div += "<p>" + movies[i].Title + "</p>";
        div += "<input type = 'button' value = 'Add To Watchlist' onclick = 'eventHandler'/>";
        res.write(div);
    }
}

// function eventHandler() {
//     querySelector.
// }

// function storeData() {
//     MongoClient.connect(mongoURL, { useUnifiedTopology: true }, function(err, db) {
//         if(err) { 
//             console.log("Connection err: " + err); return; 
//         }
//         var dbo = db.db("finalprojectyasss");
//         var coll = dbo.collection('users');
//     });
// }