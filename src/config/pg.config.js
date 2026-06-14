// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   "mydb",
//   "postgres",
//   "1234",
//   {
//     host: "localhost",
//     port: 5432,
//     dialect: "postgres",
//     logging: false
//   }
// );

// const pgConnect = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Postgres connected successfully");
//   } catch (error) {
//     console.log("Connection failed:", error);
//     process.exit(1);
//   }
// };

// pgConnect();

// module.exports = sequelize;