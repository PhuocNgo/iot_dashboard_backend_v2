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
  const sortDirection = req.query.sort_direction;
  const speciType = req.body.speci_type;

  const dateRegex =
    /^(?:\d{2}(\/|-)\d{2}(\/|-)\d{4}|\d{2}(\/|-)\d{4}|\d{2}(\/|-)\d{2})$/;
  const dateAndTimeRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|([+-]\d{2}:\d{2}))?$/;

  const bodyReqSearch = req.body.search_value;
  let query = {};

  if (devicesList.includes(bodyReqSearch)) {
    query.device_name = bodyReqSearch;
  } else if (actionsList.includes(bodyReqSearch)) {
    query.action = bodyReqSearch;
  } else if (dateAndTimeRegex.test(bodyReqSearch)) {
    query.time = bodyReqSearch;
  } else if (dateRegex.test(bodyReqSearch) && speciType === "date") {
    let [day, month, year] = bodyReqSearch.includes("-")
      ? bodyReqSearch.split("-")
      : bodyReqSearch.split("/");
    if (month.length === 4 || day.length === 4) {
      console.log(`month: ${month}, day: ${day}`);
      query = {
        $or: [
          { time: { $regex: `^${month}-${day}-\\d{2}T.*Z$` } },
          { time: { $regex: `^${day}-${month}-\\d{2}T.*Z$` } },
        ],
      };
    } else {
      query = year
        ? {
            $or: [
              { time: { $regex: `^${year}-${month}-${day}T.*Z$` } },
              { time: { $regex: `^${year}-${day}-${month}T.*Z$` } },
            ],
          }
        : {
            $or: [
              { time: { $regex: `^\\d{4}-${month}-${day}T.*Z$` } },
              { time: { $regex: `^\\d{4}-${day}-${month}T.*Z$` } },
            ],
          };
    }
  } else if (bodyReqSearch && speciType === "time") {
    const [hour, minute, second] = bodyReqSearch.split(":");
    if (second) {
      query.time = {
        $regex: `^.*T${hour}:${minute}:${second}.*Z$`,
      };
    } else {
      query.time = minute
        ? {
            $regex: `^.*T${hour}:${minute}:.*Z$`,
          }
        : {
            $regex: `^.*T${hour}:\\d{2}:.*Z$`,
          };
    }
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
