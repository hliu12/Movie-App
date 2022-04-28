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
});

app.get("/getList", (req, res) => {
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

      // Query for user id
      collection.find({ identifier: "1" }).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
        db.close();
      });
    }
  );
});

app.get("/getIds", (req, res) => {
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

      // Query for user id
      collection
        .find({ identifier: "1" }, { imdbID: 1 })
        .toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          res.send(result);
          db.close();
        });
    }
  );
});

app.post("/addMovie", (req, res) => {
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

      //   collection.insertOne({ movies: [req.body] }, (err, result) => {
      //     if (err) {
      //       console.log("Error: " + err);
      //       return;
      //     }
      //     console.log("Inserted 1 document into the collection");
      //     db.close();
      //   });

      collection.updateOne(
        { identifier: "1" },
        { $push: { movies: req.body } },
        function (err, result) {
          if (err) {
            console.log("Error: " + err);
          } else {
            console.log("Success: " + result);
          }
        }
      );
    }
  );
});

app.post("/removeMovie", (req, res) => {
  var movieId = req.body.imdbID;
  console.log("Removing movie: " + movieId);
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

      collection.updateOne(
        { identifier: "1" },
        { $pull: { movies: { imdbID: movieId } } },
        function (err, result) {
          if (err) {
            console.log("Error: " + err);
          } else {
            console.log("Success: " + result);
          }
        }
      );
    }
  );
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");

app.post("/identifier", (req, res) => {

// Connect to MongoDB
  MongoClient.connect(
    mongourl,
    { useUnifiedTopology: true },
    function (err, db) {
      if (err) {
        console.log("Connection err: " + err);
        return;
      }
      var dbo = db.db("final");
      var collection = dbo.collection("users");

      var newEntry = {identifier: req.body.identifier, movies: []};

      collection.find({identifier: req.body.identifier}).toArray(function (err, result) {
        if (err) throw err;
        if(result.length == 0) {
            collection.insertOne(newEntry, (err, result) => {
                if (err) {
                  console.log("Error: " + err);
                  return;
                }
            });
        }
        else {
            collection.find({identifier: req.body.identifier}).toArray(function (err, result) {
                if (err) throw err;
                res.send(result);
              });
        }
      });
    }
  );
})
