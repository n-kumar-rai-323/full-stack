require("dotenv").config();
const { Pool } = require("pg");

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

const connectPostgres = async () => {
  try {
    const result = await pgPool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected successfully");
    console.log("🕒 Time:", result.rows[0]);
  } catch (err) {
    console.log("❌ PostgreSQL connection failed:", err.message);

    // retry in docker (VERY IMPORTANT)
    setTimeout(connectPostgres, 3000);
  }
};

module.exports = { pgPool, connectPostgres };