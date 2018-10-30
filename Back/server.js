const PORT = 8080;
const winston = require("winston");
const express = require("express");
const bodyParser = require("body-parser");
const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(label({ label: "===>" }), timestamp(), myFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/app.log" })
  ]
});

const app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    dbConfig.url,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "You hit the root route!" });
});

require("./app/routes/location.routes.js")(app);
require("./app/routes/media.routes.js")(app);

app.listen(PORT, () => {
  logger.log("info", `App started on port ${PORT}`);
});