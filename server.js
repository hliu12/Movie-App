const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

// serve files from the public directory
app.use(express.static("public"));

router.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
  //__dirname : It will resolve to your project folder.
});

router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/login.html"));
});

router.get("/search", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/search.html"));
});

//add the router
app.use("/", router);
app.listen(process.env.port || 3000);

console.log("Running at Port 3000");
