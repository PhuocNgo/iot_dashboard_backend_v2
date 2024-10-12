const { MongoClient } = require("mongodb");

const mongodbURI = process.env.URI;

class Database {
  static client = new MongoClient(mongodbURI, {
    monitorCommands: true,
  });

  constructor() {
    this.connect();
  }

  connect() {
    Database.client
      .connect()
      .then(() => {
        console.log("Connected to mongodb server.");
      })
      .catch((err) => {
        console.log("Cannot connect to mongodb server:", err.message);
      });
  }

  static getInstanceOfDatabase() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}

module.exports = Database;
