const Database = require("../db/database");

Database.getInstanceOfDatabase();
const sensorsDataTable = Database.client
  .db("iot_dashboard_app")
  .collection("sensors data");

sensorsDataTable
  .find({
    humidity: { $gt: 44 },
  })
  .toArray()
  .then((data) => {
    console.log(data);
  });
