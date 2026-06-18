const express = require("express");
const app = express();

const routerConfig = require("./router.config");
const fs = require("fs");


// Database Connection


// Atlas MongoDB Connection
// const connectDB = require("./AtlasMongoDb.config");
// connectDB();

// Local MongoDB Connection

const connectDBS = require("./localMongoDb.config");
connectDBS();

const {pgConnect} = require("./pg.config")
pgConnect()
// Middleware


// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));


// Health Check Route

app.get("/health", (req, res) => {
  res.json({
    message: "Hello World dfdsfgsdgdfg"
  });
});


// Application Routes

app.use("/api", routerConfig);


// Handle Invalid Routes (404)

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.code = 404;
  err.status = "NOT_FOUND";

  next(err);
});


// Global Error Handling Middleware

app.use((error, req, res, next) => {
  const statusCode =
    typeof error.code === "number"
      ? error.code
      : error.statusCode || 500;

  const message = error.message || "Server Error";
  const status = error.status || "SERVER_ERROR";
  const errorDetail = error.details || null;

  // cleanup uploaded file
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  return res.status(statusCode).json({
    error: errorDetail,
    message,
    status,
  });
});
// app.use((error, req, res, next) => {
//   console.log("FULL ERROR =>", error);

//   const code =
//     typeof error.code === "number"
//       ? error.code
//       : 500;

//   res.status(code).json({
//     error: error.details || null,
//     message: error.message,
//     status: error.status || "SERVER_ERROR",
//   });
// });
// Export Express application
module.exports = app;