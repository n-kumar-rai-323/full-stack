const mongoose = require("mongoose");
const { dbConfig } = require("./config");

const dbInit = async () => {
  try {
    await mongoose.connect(dbConfig.mongodb.url);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.log("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = dbInit;