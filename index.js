const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
let config = require("./config.js");

let middleware = require("./middleware");

global.app = express();
const db = mongoose.connection;


app.use(bodyParser.json());
app.use(cors());
app.use(middleware);

app.listen(config.port, () => {
  console.log("Listening on port " + config.port);

  mongoose.connect(config.db.url);

  db.on("error", console.error.bind(console, "Error connecting to database"));
  db.once("open", () => {
    require("./routes");
  });
});
