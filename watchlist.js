const http = require("http");
const url = require("url");
const https = require("https");
const StringDecoder = require("string_decoder").StringDecoder;

const MongoClient = require("mongodb").MongoClient;
const mongoURL =
  "mongodb+srv://sliu17:passwordcs20@cs20.zhfqr.mongodb.net/finalprojectyasss?retryWrites=true&w=majority";

var server = http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var pageReq = req.url;
    // Update the pageReq variable to focus on the path section
    if ((qmark = pageReq.indexOf("?")) > 0) pageReq = req.url.substr(0, qmark);
    // If the page is freshly loaded, show the user the input form
    if (pageReq == "/") {
      printForm(res);
    } else if (pageReq == "/process") {
      // Check what type of input they entered
      var params = new URLSearchParams(req.url);
      var inputType = params.get("type");
      // Get the user's input
      var qobj = url.parse(req.url, true).query;
      var uinput = qobj.input;
      // Search for the user's input in the database
      searchAPI(res, uinput, pageReq);
      let buffer = "";
      let decoder = new StringDecoder("utf-8");

      // console.log('HERE1');

      // console.log(data);

      req.on("data", function (data) {
        // buffer += decoder.write(data);
        console.log("HERE ON");
        console.log(data);
        // console.log(buffer);
      });
      req.on("end", function () {
        console.log("HERE END");
        // buffer += decoder.end();
        // console.log(buffer);
      });
    }
  })
  .listen(8080);

function printForm(res) {
  form = "<form method='get' action = '/process'>";
  form += "Favorite actor: <input type = 'text' name = 'input'><br>";
  form += "<br><input type = 'submit'>";
  res.write(form);
}

function searchAPI(myRes, query, pageReq) {
  const api_url = "https://omdbapi.com/?apikey=4c3128ae&s=" + query;
  https
    .get(api_url, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        data = JSON.parse(data);
        printResults(myRes, data.Search, pageReq);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
}

function printResults(res, movies, pageReq) {
  div = "<script>var watchlist = []</script>";
  for (i = 0; i < movies.length; i++) {
    div += "<div>";
    div += "<p>" + movies[i].Title + "</p>";
    div += "<input type='hidden' id='" + i + "'>";
    div +=
      "<input type='button' id='button" + i + "' value='Add To Watchlist'>";
    div +=
      "<script>document.getElementById('" +
      i +
      "').value = \"" +
      movies[i].Title +
      '";';
    div +=
      "function addMovie() { watchlist.push(document.getElementById('" +
      i +
      "').value); console.log(watchlist);";
    div +=
      "let xhr = new XMLHttpRequest(); xhr.open('POST','watchlist.js'); xhr.setRequestHeader('Content-Type','text/html');";
    div +=
      "let payload = JSON.stringify(watchlist); console.log('Payload' + payload); xhr.send(payload);";
    div +=
      "} document.getElementById('button" +
      i +
      "').addEventListener('click',addMovie);";
    div += "</script>";
    div += "</div>";
  }
  res.write(div);
  // storeData(watchlist);
}

function storeData(watchlist) {
  MongoClient.connect(
    mongoURL,
    { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        console.log("Connection err: " + err);
        return;
      }
      var dbo = db.db("finalprojectyasss");
      var coll = dbo.collection("users");

      var formattedData = { watchlist: watchlist };

      coll.insertOne(formattedData, function (err, res) {
        if (err) {
          return console.log("Insert error: " + err);
        }
      });
    }
  );
}
