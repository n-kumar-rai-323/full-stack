const pgRoute = require("express").Router();
const bodyValidator = require("../../middlewares/request-validator.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const { pgAuthValidatorDTO } = require("./pg.auth.validator");
const PGAuthCtrl = require("./pgauth.controller");

pgRoute.post(
  "/users",
  uploader().single("image"),
  bodyValidator(pgAuthValidatorDTO),
  PGAuthCtrl.registerUser,
);
module.exports = pgRoute;
