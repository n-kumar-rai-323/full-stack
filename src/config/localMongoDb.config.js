const mongoose = require("mongoose");
const { localMongoConfig } = require("./config");

const localMongoDB = async () => {
  try {
    await mongoose.connect(localMongoConfig.localdburl, {
      dbname: localMongoConfig.dbname,
      autoCreate: true,
      autoIndex: true,
    });

    console.log("******* Database Connection Successfully *******");
  } catch (exception) {
    console.error("MongoDB connection failed:", exception.message);
    process.exit(1);
  }
};

module.exports = localMongoDB;
