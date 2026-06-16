const { localPGSqlConfig } = require("../src/config/config");

const db = localPGSqlConfig.pgdb;

module.exports = {
  development: {
    username: db.username,
    password: db.password,
    database: db.database,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
  },

  test: {
    username: db.username,
    password: db.password,
    database: db.database,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
  },

  production: {
    username: db.username,
    password: db.password,
    database: db.database,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
  },
};