const authRoute = require("express").Router();
const auth = require("../../middlewares/auth.midleware");
const bodyValidator = require("../../middlewares/request-validator.middleware");
const uploader = require("../../middlewares/uploader.middleware");
const authCtrl = require("./auth.controller");
const { UserRegisterDTO, LoginDTO } = require("./auth.validator");

authRoute.post("/register", uploader().single("image"), bodyValidator(UserRegisterDTO),authCtrl.registerUser);
authRoute.get("/activate/:token",authCtrl.activateAccount)
authRoute.post('/login',bodyValidator(LoginDTO), authCtrl.login)
authRoute.get("/profile", auth(),authCtrl.profile);
authRoute.post("/forget-password", authCtrl.forgetPassword)
authRoute.post("/reset-password/:token", authCtrl.resetPassword);
authRoute.patch("/update-profile", uploader().single("image"), auth(),authCtrl.updateProfile)
module.exports = authRoute;
