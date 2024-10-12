const MqttConnection = require("../mqtt");
const getMqttMessage = require("../mqtt/getMqttMessage");

const changeDeviceStatus = async (req, res, topicSub, topicPub) => {
  const message = req.body.message;
  let receivedMessageRes = "";

  MqttConnection.client.publish(topicSub, message);

  try {
    receivedMessageRes = await getMqttMessage(topicPub);
    res.status(200).send({ message: receivedMessageRes });
  } catch (err) {
    console.log(`Cannot get message from topic: ${err.message}!`);
    res.status(404).send({ message: receivedMessageRes });
  }
};

module.exports = changeDeviceStatus;
