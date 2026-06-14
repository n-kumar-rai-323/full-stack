require("dotenv").config();

const dbConfig = {
  mongodb: {
    url: process.env.MONGO_URL,
  },
};

const cloudConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = { dbConfig, cloudConfig };