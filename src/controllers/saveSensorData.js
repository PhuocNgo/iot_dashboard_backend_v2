const Database = require("../db/database");
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME_SENSOR;

const saveSensorData = (req, res) => {
  const dataReceived = req.body.data;
  const collection = Database.client.db(dbName).collection(collectionName);
  const newSensorDataDoc = {
    temperature: dataReceived.temperature,
    humidity: dataReceived.humidity,
    brightness: dataReceived.brightness,
    time: dataReceived.time,
  };

  collection
    .insertOne(newSensorDataDoc)
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

module.exports = saveSensorData;
