const express = require("express");
const app = express();
const routerConfig = require("./router.config");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.json({ message: "Hello World dfdsfgsdgdfg  " });
});

app.use("/api", routerConfig);
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.code = 404;
  err.status = "NOT_FOUND";
  next(err);
});

//middleware
app.use((error, req, res, next) => {
  const code = error.code || 500;
  const msg = error.message || "Server error";
  const status = error.status || "SERVER_ERROR";
  const errorDetail = error.details || null;

  res.status(code).json({
    error: errorDetail,
    message: msg,
    status: status,
    options: null,
  });
});
module.exports = app;
