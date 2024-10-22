const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const getAndSearchActionHistories = (req, res) => {
  const devicesList = ["fan", "light", "air conditioner"];
  const actionsList = ["on", "off"];

  const collection = Database.client
    .db(dbName)
    .collection(process.env.COLLECTION_NAME_HISTORY);

  // query params
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = (page - 1) * pageSize;
  const sortField = req.query.sort_field;
  const sortDirection = req.query.sort;

  const bodyReqSearch = req.body.search_value;
  const query = {};

  if (devicesList.includes(bodyReqSearch)) {
    query.device_name = bodyReqSearch;
  } else if (actionsList.includes(bodyReqSearch)) {
    query.action = bodyReqSearch;
  } else if (bodyReqSearch) {
    const [hour, minute] = bodyReqSearch.split(":");
    query.time = minute
      ? {
          $regex: `^.*T${hour}:${minute}:.*Z$`,
        }
      : {
          $regex: `^.*T${hour}:\\d{2}:.*Z$`,
        };
  }

  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .sort(sortField, sortDirection)
    .toArray()
    .then((data) => {
      collection.countDocuments(query).then((totalCount) => {
        console.log(`Got action_histories data.`);
        res.status(200).send({
          data: data,
          totalCount: totalCount,
        });
      });
    })
    .catch((err) => {
      console.log(`Cannot get action_histories data: ${err.message}!`);
      res.status(404).send({
        data: [],
        totalCount: 0,
      });
    });
};

module.exports = getAndSearchActionHistories;
