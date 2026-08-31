const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5435,
  database: process.env.DB_NAME || "pollenaware_risk",
  user: process.env.DB_USER || "pollenaware",
  password: process.env.DB_PASSWORD || "pollenaware_dev",
});

module.exports = pool;