require("dotenv").config();

const http = require("http");
const app = require("./src/config/express.config");

const dbInit = require("./src/config/mongodb.config");
const { connectPostgres } = require("./src/config/pg");

// DB START
// dbInit();
// connectPostgres();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});