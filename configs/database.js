const { Client } = require("pg");

const client = new Client(process.env.DB_URL);              //Configuring Postgres Database

module.exports = client;