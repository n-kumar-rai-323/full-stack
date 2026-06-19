require("dotenv").config();

const atlasMongoDbConfig = {
  atlasdburl: process.env.MONGODB_URL,
  dbname: process.env.MONGODB,
};
const localMongoConfig={
  localdburl: process.env.LOCALMONGODB_URL,
  dbname:process.env.LOCALMONGODBNAME
}
const dbConfig = {
  mongodb: {
    url: process.env.MONGO_URL,
  },
};
const localPGSqlConfig = {
  pgdb: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,   
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,    
  }
};

const cloudConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

const smtpConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10) || 587,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM,
};

const AppConfig={
  frontUrl:process.env.FRONTEND_URL,
  jwtSecret:process.env.JWT_SECRET
}

module.exports = {
  AppConfig,
  localPGSqlConfig,
  localMongoConfig,
  dbConfig,
  cloudConfig,
  smtpConfig,
  atlasMongoDbConfig,
};