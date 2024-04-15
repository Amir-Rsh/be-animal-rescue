const ENV = process.env.NODE_ENV || "production";
const { MongoClient } = require("mongodb");

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
} else {
  config.connectionString = process.env.DATABASE_URL;
}

const client = new MongoClient(config.connectionString);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set");
}
module.exports = client;
