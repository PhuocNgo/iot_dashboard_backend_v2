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
  const sortDirection = req.query.sort_direction;
  const bodyReq = req.body.search_value;
  const bodyReqSpeciType = req.body.speci_type;
  let query = {};

  const dateRegex =
    /^(?:\d{2}(\/|-)\d{2}(\/|-)\d{4}|\d{2}(\/|-)\d{4}|\d{2}(\/|-)\d{2})$/;
  const dateAndTimeRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|([+-]\d{2}:\d{2}))?$/;

  if (bodyReq) {
    if (dateAndTimeRegex.test(bodyReq)) {
      query.time = bodyReq;
    }
    switch (bodyReqSpeciType) {
      case "date":
        if (dateRegex.test(bodyReq)) {
          console.log("bodyReq::", bodyReq);
          let [day, month, year] = bodyReq.includes("-")
            ? bodyReq.split("-")
            : bodyReq.split("/");
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
        }

        break;
      case "time":
        {
          const [hour, minute, second] = bodyReq.split(":");
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
        break;
      case "temperature":
        query.temperature = {
          $gte: parseFloat(bodyReq),
          $lte: parseFloat(bodyReq) + 0.9,
        };
        break;
      case "brightness":
        query.brightness = {
          $gte: parseFloat(bodyReq),
          $lte: parseFloat(bodyReq) + 100,
        };
        break;
      case "humidity":
        query.humidity = {
          $gte: parseFloat(bodyReq),
          $lte: parseFloat(bodyReq) + 10,
        };
        break;
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
