const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const collectionName = process.env.COLLECTION_NAME_HISTORY;

const getActionHistory = (req, res) => {
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = (page - 1) * pageSize;
  const collection = Database.client.db(dbName).collection(collectionName);
  const query = {};

  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .toArray()
    .then((data) => {
      console.log(`Got action histories.`);
      res.status(200).send({
        data: data,
      });
    })
    .catch((err) => {
      console.log(`Cannot get action histories: ${err.message}!`);
      res.status(404).send({
        data: [],
      });
    });
};

module.exports = getActionHistory;