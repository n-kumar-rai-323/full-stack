const { Sequelize } = require("sequelize");
const { localPGSqlConfig } = require("./config");

const db = localPGSqlConfig.pgdb;

// Create Sequelize instance
const sequelize = new Sequelize(
  db.name,
  db.username,   
  db.password,
  {
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    logging: false,
  }
);

// Test connection
const pgConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Postgres connected successfully");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, pgConnect };