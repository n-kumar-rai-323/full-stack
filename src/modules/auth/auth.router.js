const authRoute = require("express").Router();
const bodyValidator = require("../../middlewares/request-validator.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const authCtrl = require("./auth.controller");
const { UserRegisterDTO } = require("./auth.validator");

authRoute.post("/register", uploader().single("image"), bodyValidator(UserRegisterDTO),authCtrl.registerUser);


module.exports = authRoute;
