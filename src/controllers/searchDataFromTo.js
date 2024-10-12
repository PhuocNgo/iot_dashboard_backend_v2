const Database = require("../db/database");
const dbName = process.env.DB_NAME;

function parseTimeString(timeString) {
  const [time, date] = timeString.split(", ");
  const [hour, minute] = time.split(":");
  const [day, month, year] = date.split("/");

  const hours =
    time.includes("pm") && hour !== "12" ? parseInt(hour) + 12 : parseInt(hour);
  const minutes = parseInt(minute);

  return new Date(year, month - 1, day, hours, minutes);
}

const searchDataFromTo = (req, res, collectionName) => {
  const deviceName = req.query.device_name;
  const from = parseTimeString(req.query.from);
  const to = parseTimeString(req.query.to);

  const query = {
    deviceName,
    time: { $gte: from, $lte: to },
  };

  const collection = Database.client.db(dbName).collection(collectionName);
  collection
    .find(query)
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
