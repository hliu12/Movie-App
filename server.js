const request = require("request");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const https = require("https");
const MongoClient = require("mongodb").MongoClient;
const mongourl =
  "mongodb+srv://testUser:Sparky64@cluster0.zxgod.mongodb.net/stockTicker?retryWrites=true&w=majority";

// serve files from the public directory
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Assign route
app.get("/api", (req, res) => {
  console.log("Req body: " + req.body);
  var search = req.query.search;
  console.log("Search term: " + search);

  const api_url = "https://omdbapi.com/?apikey=4c3128ae&s=" + search;

  https.get(api_url, (response) => {
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      console.log(body);
      res.send(body);
    });
  });

  //   request(api_url, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       var data = JSON.parse(body);
  //       console.log(data);
  //       res.json(data);
  //     }
  //   });
});

// app.get("/movieData", (req, res) => {
//   console.log("Movie data function ran");
//   console.log(req.body);
// });

app.post("/addMovie", (req, res) => {
  console.log("req: " + req.body);
  console.log("req.body.title: " + req.body.Title);
  var stringRes = JSON.stringify(req.body);
  console.log(stringRes);

  // Connect to MongoDB
  MongoClient.connect(
    mongourl,
    { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        console.log("Connection err: " + err);
        return;
      }
      console.log("Connected successfully to server");
      var dbo = db.db("final");
      var collection = dbo.collection("users");

      db.close();
    }
  );
});
//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
