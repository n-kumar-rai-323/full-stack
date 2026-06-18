const cloudinarySvc = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const emailSvc = require("../../services/email.service");
const { randomStringGenerate } = require("../../utilities/helpers");
const { UserStatus } = require("../../config/pgConstants");
const User = require("./pg.model");
const authSvc = require("./pg.auth.service");
const jwt=require("jsonwebtoken");
const { AppConfig } = require("../../config/config");
class PGAuthController {
  registerUser = async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Image is required",
          status: "FILE_MISSING",
        });
      }

      const payload = await authSvc.transformData(req);

      const authobj = await authSvc.dataStore(payload);
      await authSvc.activationNotify(authobj);
      return res.status(201).json({
        message: "User registered successfully",
        status: "REGISTERED_SUCCESS",
        data: authobj,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
        error: error.errors || null,
        status: "SERVER_ERROR",
      });
    }
  };
  activateAccount = async (req, res, next) => {
    try {
      const token = req.params.token;

      let authInfo = await authSvc.getSingleRowByFilter({
        activationCode: token,
      });

      if (!authInfo) {
        return res.status(404).json({
          message: "Token is invalid",
          status: "USER_NOT_FOUND",
        });
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
      await authSvc.notifyUserAcctivateSucceffully(authInfo);
      return res.json({
        data: null,
        message: "Congratulation! Your account has been verified successfully!",
        status: "VERIFICATION_SUCCESS",
      });
    } catch (error) {
      return res.status(500).json({
        error: null,
        message: error.message,
        status: "SERVER_ERROR",
      });
    }
  };
  login=async(req,res,next)=>{
    try{
      const {email,password}=req.body
         // 1. FIND USER
    const userDetail = await authSvc.getSingleRowByFilter({
      email: email,
    });

    if (!userDetail) {
      return res.status(422).json({
        message: "User not registered",
        status: "USER_NOT_REGISTERED",
      });
    }

         // 2. CHECK PASSWORD
    const isMatch = bcrypt.compareSync(password, userDetail.password);

    if (!isMatch) {
      return res.status(422).json({
        message: "Credentials does not match",
        status: "CREDENTIALS_NOT_MATCH",
      });
    }
    if(userDetail.status !==UserStatus.ACTIVE || userDetail.activationCode !==null){
      return res.status(403).json({
        message:"Account not activated",
        status:"AccOUNT NOT ACTIVATED"
      })
    }
    const user=userDetail.toJSON();
    delete user.password;
    delete user.activationCode;
    delete user.forgetPasswordCode;

    let accessToken=jwt.sign({
      sub:user._id,
      type:"Bearer"
    },AppConfig.jwtSecret,{
      expiresIn:'1hr'
    })
    let refreshToken=jwt.sign({
      sub:user._id,
      type:"Refresh",
    },AppConfig.jwtSecret,{
      expiresIn:'2hr'
    })
    return res.status(200).json({
      message:"Login successful",
      status:"LOGIN_SUCCESS",
      data:{accessToken,refreshToken}
    })
    }catch(exception){
      throw(exception)
    }
  }
}

module.exports = new PGAuthController();
