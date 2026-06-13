const authRoute = require("express").Router();
const authCtrl = require("./auth.controller");


authRoute.post("/register", authCtrl.register);
authRoute.get("/users", authCtrl.getUsersAll);

module.exports = authRoute;
