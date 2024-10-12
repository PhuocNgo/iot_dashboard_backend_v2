const Database = require("../db/database");
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME_HISTORY;

const saveActionsHistory = (req, res) => {
  const dataReceived = req.body.data;
  const collection = Database.client.db(dbName).collection(collectionName);
  const newActionHistoryDoc = {
    "device-name": dataReceived["device-name"],
    action: dataReceived.action,
    time: dataReceived.time,
  };

  collection
    .insertOne(newActionHistoryDoc)
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

module.exports = saveActionsHistory;
