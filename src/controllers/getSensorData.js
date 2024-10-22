const getMqttMessage = require("../mqtt/getMqttMessage");
const { sensorsDataPub } = require("../mqtt/topics");

const getSensorData = async (_, res) => {
  try {
    const dataReceived = await getMqttMessage(sensorsDataPub);
    const dataRes = JSON.parse(dataReceived);

    console.log("Got sensor data directly.");
    res.status(200).send({
      data: dataRes,
    });
  } catch (err) {
    console.log(`Cannot get sensor data directly: ${err.message}!`);
    res.status(404).send({
      data: {},
    });
  }
};

module.exports = getSensorData;
