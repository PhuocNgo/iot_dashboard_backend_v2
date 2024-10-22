const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv/config");
const app = express();

const router = require("./routes/router");

// db connection
require("./db/database").getInstanceOfDatabase();
require("./mqtt/index").getInstanceOfMqttConnection();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// apis
app.get("/", (_, res) => {
  res.status(200).send({ message: "Hello World!" });
});

app.use("/api/v1", router);

module.exports = app;
