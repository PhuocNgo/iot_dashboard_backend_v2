const Database = require("../db/database");
const dbName = process.env.DB_NAME;

const getAndSearchSensorDatas = (req, res) => {
  const collection = Database.client
    .db(dbName)
    .collection(process.env.COLLECTION_NAME_SENSOR);

  // query params
  const page = parseInt(req.query.page);
  const pageSize = parseInt(req.query.page_size);
  const skipPages = Math.abs(page - 1) * pageSize;
  const sortField = req.query.sort_field;
  const sortDirection = req.query.sort;
  const bodyReq = req.body.search_value;
  const bodyReqSpeciType = req.body.speci_type;
  const query = {};

  switch (bodyReqSpeciType) {
    case "time":
      {
        const [hour, minute] = bodyReq.split(":");
        query.time = minute
          ? {
              $regex: `^.*T${hour}:${minute}:.*Z$`,
            }
          : {
              $regex: `^.*T${hour}:\\d{2}:.*Z$`,
            };
      }
      break;
    case "temperature":
      query.temperature = bodyReq;
      break;
    case "brightness":
      query.brightness = bodyReq;
      break;
    case "humidity":
      query.humidity = bodyReq;
      break;
  }

  collection
    .find(query)
    .skip(skipPages)
    .limit(pageSize)
    .sort(sortField, sortDirection)
    .toArray()
    .then((data) => {
      collection.countDocuments(query).then((totalCount) => {
        console.log(`Got sensor_datas data.`);
        res.status(200).send({
          data: data,
          totalCount: totalCount,
        });
      });
    })
    .catch((err) => {
      console.log(`Cannot get sensor_datas: ${err.message}!`);
      res.status(404).send({
        data: [],
        totalCount: 0,
      });
    });
};

module.exports = getAndSearchSensorDatas;
