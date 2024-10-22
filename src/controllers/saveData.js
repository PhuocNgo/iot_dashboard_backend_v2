const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const saveData = (req, res) => {
  const dataReceived = req.body.data;
  const collectionName = req.params.data_name;
  const collection = Database.client.db(dbName).collection(collectionName);
  let newDoc = {};

  switch (collectionName) {
    case process.env.COLLECTION_NAME_HISTORY:
      newDoc = {
        device_name: dataReceived.device_name,
        action: dataReceived.action,
        time: dataReceived.time,
      };
      break;
    case process.env.COLLECTION_NAME_SENSOR:
      newDoc = {
        temperature: dataReceived.temperature,
        humidity: dataReceived.humidity,
        brightness: dataReceived.brightness,
        time: dataReceived.time,
      };
      break;
  }

  collection
    .insertOne(newDoc)
    .then(() => {
      res.status(201).send({
        message: "Saved.",
      });
      console.log("Saved.");
    })
    .catch((err) => {
      res.status(500).send({
        message: `Cannot save: ${err.message}!`,
      });
      console.log(`Cannot save: ${err.message}!`);
    });
};

module.exports = saveData;
