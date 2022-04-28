const request = require("request");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const router = express.Router();
const https = require("https");
const MongoClient = require("mongodb").MongoClient;
const mongourl =
  "mongodb+srv://sliu17:passwordcs20@cs20.zhfqr.mongodb.net/final?retryWrites=true&w=majority";

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
  //   console.log("req: " + req.body);
  //   console.log("req.body.title: " + req.body.Title);
  //   var stringRes = JSON.stringify(req.body);
  //   console.log(stringRes);
  var movieId = req.body.imdbID;
  console.log(movieId);

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

      collection.insertOne({ movies: [req.body] }, (err, result) => {
        if (err) {
          console.log("Error: " + err);
          return;
        }
        console.log("Inserted 1 document into the collection");
        db.close();
      });

      //   collection.updateOne(
      //     { user_id: 1 },
      //     { $push: { movies: movieId } },
      //     function (err, result) {
      //       if (err) {
      //         console.log("Error: " + err);
      //       } else {
      //         console.log("Success: " + result);
      //       }
      //     }
      //   );

      //   db.close();
    }
  );
});
//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
