const MqttConnection = require(".");

const getMqttMessage = (topic) => {
  return new Promise((resolve) => {
    const handleMessage = (topicReceived, receivedMessage) => {
      if (topic === topicReceived) {
        resolve(receivedMessage.toString());
        MqttConnection.client.removeListener("message", handleMessage);
        console.log(
          `Received message from topic ${topic}: ${receivedMessage}.`
        );
      }
    };

    MqttConnection.client.on("message", handleMessage);
  });
};

module.exports = getMqttMessage;
