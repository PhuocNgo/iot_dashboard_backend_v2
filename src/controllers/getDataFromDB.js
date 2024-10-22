const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const getDataForActionHistories = (collection, req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = (page - 1) * pageSize;

  const sortField = req.query.sort_field;
  const sortDirection = req.query.sort;
  const field = req.query.search_field;
  const time = req.query.time;
  const action = req.query.action;

  const query = {};

  if (field) {
    query.deviceName = field;
  }

  if (time) {
    query.time = time;
  }

  if (action) {
    query.action = action;
  }

  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .sort(sortField, sortDirection)
    .toArray()
    .then((data) => {
      console.log(`Got action_histories data.`);
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      console.log(`Cannot get action_histories data: ${err.message}!`);
      res.status(404).send({
        data: [],
      });
    });
};

const getDataForSensorDatas = (collection, req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = (page - 1) * pageSize;

  const sortField = req.query.sort_field;
  const sortDirection = req.query.sort;
  const field = req.query.search_field;
  const query = {};

  if (field) {
    query.deviceName = field;
  }

  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .sort(sortField, sortDirection)
    .toArray()
    .then((data) => {
      console.log(`Got action_histories data.`);
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      console.log(`Cannot get action_histories data: ${err.message}!`);
      res.status(404).send({
        data: [],
      });
    });
};

const getDataFromDB = (req, res) => {
  const collectionName = req.query.collection_name;
  const collection = Database.client.db(dbName).collection(collectionName);
  switch (collectionName) {
    case process.env.COLLECTION_NAME_HISTORY:
      getDataForActionHistories(collection, req, res);
      break;
    case process.env.COLLECTION_NAME_SENSOR:
      getDataForSensorDatas(collection, req, res);
      break;
  }
};

module.exports = getDataFromDB;
