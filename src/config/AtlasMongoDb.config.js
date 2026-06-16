const mongoose = require("mongoose");
const { atlasMongoDbConfig } = require("./config");

const atlasMongoDBInit = async () => {
  try {
    await mongoose.connect(atlasMongoDbConfig.atlasdburl, {
      dbName: atlasMongoDbConfig.dbname,
      autoCreate: true,
      autoIndex: true,
    });

    console.log("******** Database connected successfully *********");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = atlasMongoDBInit;