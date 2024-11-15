const { default: mqtt } = require("mqtt");
const {
  fanPub,
  lightPub,
  airConditionerPub,
  sensorsDataPub,
  newLightPub1,
  newLightPub2,
  newLightPub3,
} = require("./topics");

const clientInfor = {
  clientId: process.env.CLIENT_ID,
  username: "phuocngo",
  password: "b21dccn597",
};

const urlMqtt = process.env.MQTT_URL;

class MqttConnection {
  static client = mqtt.connect(urlMqtt, clientInfor);

  constructor() {
    this.connect();
  }

  connect() {
    MqttConnection.client.on("connect", () => {
      console.log("Connected to mqtt broker server.");
      this.subscribe();
    });

    MqttConnection.client.on("error", (err) => {
      console.log(`Cannot connect to mqtt broker server: ${err}!`);
    });
  }

  subscribe() {
    MqttConnection.client.subscribe(
      [
        fanPub,
        lightPub,
        airConditionerPub,
        sensorsDataPub,
        newLightPub1,
        newLightPub2,
        newLightPub3,
      ],
      () => {
        console.log(
          `Subscribed to ${fanPub}, ${lightPub}, ${airConditionerPub}, ${sensorsDataPub} topics.`
        );
      }
    );
  }

  static getInstanceOfMqttConnection() {
    if (!this.instance) {
      this.instance = new MqttConnection();
    }
    return this.instance;
  }
}

module.exports = MqttConnection;
