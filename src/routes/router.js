const express = require("express");

const changeDeviceStatus = require("../controllers/changeDeviceStatus");
const saveSensorData = require("../controllers/saveSensorData");
const saveActionsHistory = require("../controllers/saveActionHistory");
const getSensorDataFromDB = require("../controllers/getSensorDataFromDB");
const getActionHistory = require("../controllers/getActionHistory");
const getSensorData = require("../controllers/getSensorData");

const {
  lightSub,
  lightPub,
  fanSub,
  fanPub,
  airConditionerSub,
  airConditionerPub,
} = require("../mqtt/topics");
const searchDataFromTo = require("../controllers/searchDataFromTo");

const router = express.Router();

// post
router.post("/light-shift", async (req, res) => {
  changeDeviceStatus(req, res, lightSub, lightPub);
});

router.post("/fan-shift", async (req, res) => {
  changeDeviceStatus(req, res, fanSub, fanPub);
});

router.post("/air-conditioner-shift", async (req, res) => {
  changeDeviceStatus(req, res, airConditionerSub, airConditionerPub);
});

router.post("/sensor-data-db", saveSensorData);
router.post("/action-history", saveActionsHistory);

// get
router.get("/sensor-data-db", getSensorDataFromDB);
router.get("/action-history", getActionHistory);
router.get("/sensor-data", getSensorData);

router.get("/search-action", (req, res) => {
  searchDataFromTo(req, res);
});

router.get("/search-action", (req, res) => {
  const collectionName = process.env.COLLECTION_NAME_HISTORY;
  searchDataFromTo(req, res, collectionName);
});

router.get("/search-sensor", (req, res) => {
  const collectionName = process.env.COLLECTION_NAME_SENSOR;
  searchDataFromTo(req, res, collectionName);
});

module.exports = router;
