const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const searchDataFromTo = (req, res, collectionName) => {
  const deviceName = req.query.device_name;
  const from = req.query.from;
  const to = req.query.to;
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = (page - 1) * pageSize;

  const query = deviceName
    ? {
        deviceName,
        time: { $gte: from, $lte: to },
      }
    : {
        time: { $gte: from, $lte: to },
      };

  const collection = Database.client.db(dbName).collection(collectionName);
  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .toArray()
    .then((data) => {
      console.log(
        `Got data from collection ${collectionName}: ${from} - ${to}.`
      );
      res.status(200).send({
        data,
      });
    })
    .catch((err) => {
      console.log(
        `Cannot get data from collection ${collectionName}: ${err.message}!`
      );
      res.status(404).send({
        data: [],
      });
    });
};

module.exports = searchDataFromTo;
