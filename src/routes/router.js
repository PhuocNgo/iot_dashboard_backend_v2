const express = require("express");

const changeDeviceStatus = require("../controllers/changeDeviceStatus");
const saveData = require("../controllers/saveData");
const getSensorData = require("../controllers/getSensorData");

const searchDataFromTo = require("../controllers/searchDataFromTo");
const getAndSearchActionHistories = require("../controllers/getAndSearchActionHistories");
const getAndSearchSensorDatas = require("../controllers/getAndSearchSensorDatas");
const getSensorData1 = require("../controllers/getSensorData1");

const router = express.Router();

// post
router.post("/device-status-shift", changeDeviceStatus);
router.post("/data/:data_name", saveData);

// get:
router.get("/sensor-data", getSensorData);
router.get("/sensor-data-new", getSensorData1);

// search and get:
router.post("/results/action_histories", getAndSearchActionHistories);
router.post("/results/sensor_datas", getAndSearchSensorDatas);

// search:
router.get("/results/action", (req, res) => {
  const collectionName = process.env.COLLECTION_NAME_HISTORY;
  searchDataFromTo(req, res, collectionName);
});

router.get("/results/sensor", (req, res) => {
  const collectionName = process.env.COLLECTION_NAME_SENSOR;
  searchDataFromTo(req, res, collectionName);
});

module.exports = router;
