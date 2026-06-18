const { AppConfig } = require("../../config/config");
const { UserStatus } = require("../../config/constants");
const authSvc = require("./auth.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
class AuthController {
  registerUser = async (req, res, next) => {
    try {
      // let payload = req.body;

      // payload.image = await cloudinarySvc.uploadFile(req.file.path, "auth/");
      // payload.password = bcrypt.hashSync(payload.password, 12);
      // payload.status = UserStatus.INACTIVE;
      // payload.activationCode = randomStringGenerate(100);
      const payload = await authSvc.transformAuthData(req);
      // db store
      // const authobj = new authModel(payload);
      // await authobj.save();

      const authobj = await authSvc.dataStore(payload);

      // notification
      // await emailSvc.sendEmail({
      //   to:payload.email,
      //   sub:"",

      //   message:"<h1>Hello World</h1>"
      // })

      await authSvc.activationNotify(authobj);

      res.json({
        data: authobj,
        message: "Your account has been registered successfully",
        status: "REGISTERED_SUCCESS",
        options: null,
      });
    } catch (err) {
      next(err);
    }
  };
  activateAccount = async (req, res, next) => {
    try {
      const token = req.params.token;
      let authInfo = await authSvc.getSingleRowByFilter({
        activationCode: token,
      });
      if (!authInfo) {
        throw {
          code: 404,
          message: "Token is invalid",
          status: "USER_NOT_FOUND",
        };
      }
      authInfo = await authSvc.updateOneRowByFilter(
        {
          _id: authInfo._id,
        },
        {
          activationCode: null,
          status: UserStatus.ACTIVE,
        },
      );
      await authSvc.notifyActivationSuccess(authInfo);
      res.json({
        data: null,
        message:
          "Congratulation! Your account has been verified successfully! Please login to continue",
        status: "VERIFICATION_SUCCESS",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const userDetail = await authSvc.getSingleRowByFilter({
        email: email,
      });
      if (!userDetail) {
        throw {
          code: 422,
          message: "User not registered",
          status: "USER_NOT_REGISTERED",
        };
      }
      const isMatch = bcrypt.compareSync(password, userDetail.password);
      if (!isMatch) {
        throw {
          code: 422,
          message: "Credentials does not match",
          status: "CREDENTIALS_NOT_MATCH",
        };
      }
      if (
        userDetail.status !== UserStatus.ACTIVE ||
        userDetail.activationCode !== null
      ) {
        return res.status(403).json({
          message: "Account not activated",
          status: "ACCOUNT_NOT_ACTIVE",
        });
      }
      let accessToken = jwt.sign(
        {
          sub: userDetail._id,
          type: "Bearer",
        },
        AppConfig.jwtSecret,
        {
          expiresIn: "1hr",
        },
      );
      let refresToken =jwt.sign({
        sub:userDetail._id,
        type:"Refresh",

      },AppConfig.jwtSecret,{
        expiresIn:"4hr"
      })
      return res.status(200).json({
        message: "Login successful",
        status: "LOGIN_SUCCESS",
        data: {accessToken,refresToken},
      });
    } catch (exception) {
      throw exception;
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
