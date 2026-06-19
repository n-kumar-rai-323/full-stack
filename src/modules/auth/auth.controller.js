const { AppConfig } = require("../../config/config");
const { UserStatus } = require("../../config/constants");
const auth = require("../../middlewares/auth.midleware");
const AuthModel = require("./auth.model");
const authSvc = require("./auth.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
class AuthController {
  // registerUser = async (req, res, next) => {
  //   try {
  //     // let payload = req.body;

  //     // payload.image = await cloudinarySvc.uploadFile(req.file.path, "auth/");
  //     // payload.password = bcrypt.hashSync(payload.password, 12);
  //     // payload.status = UserStatus.INACTIVE;
  //     // payload.activationCode = randomStringGenerate(100);
  //     const payload = await authSvc.transformAuthData(req);
  //     // db store
  //     // const authobj = new authModel(payload);
  //     // await authobj.save();

  //     const authobj = await authSvc.dataStore(payload);

  //     // notification
  //     // await emailSvc.sendEmail({
  //     //   to:payload.email,
  //     //   sub:"",

  //     //   message:"<h1>Hello World</h1>"
  //     // })

  //     await authSvc.activationNotify(authobj);

  //     res.json({
  //       data: authobj,
  //       message: "Your account has been registered successfully",
  //       status: "REGISTERED_SUCCESS",
  //       options: null,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // };
registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const existing = await authSvc.getSingleRowByFilter({ email });

    if (existing) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const payload = await authSvc.transformAuthData(req);

    const user = await authSvc.dataStore(payload);

    // 🔥 THIS WAS MISSING (REAL ISSUE FIX)
    await authSvc.sendActivationEmail(user);

    return res.status(201).json({
      message: "User registered successfully. Check email to activate account.",
      data: user,
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

      if (!email || !password) {
        return res.status(400).json({
          status: "VALIDATION_ERROR",
          message: "Email and password required",
        });
      }

      const userDetail = await AuthModel.findOne({ email });

      if (!userDetail || !userDetail.password) {
        return res.status(401).json({
          status: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        });
      }
      console.log("USER DETAIL:", userDetail);
      console.log("REQ BODY:", req.body);

      // 👇 यहीँ राख्ने
      console.log("RAW INPUT PASSWORD:", password);
      console.log("DB HASH:", userDetail.password);
      const isMatch = bcrypt.compareSync(password, userDetail.password);
      console.log("PASSWORD MATCH RESULT:", isMatch);
      if (!isMatch) {
        return res.status(401).json({
          status: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        });
      }

      if (userDetail.status !== UserStatus.ACTIVE) {
        return res.status(403).json({
          status: "ACCOUNT_NOT_ACTIVE",
          message: "Account not active",
        });
      }

      const accessToken = jwt.sign(
        { sub: userDetail._id, type: "Bearer" },
        AppConfig.jwtSecret,
        { expiresIn: "1h" },
      );

      const refreshToken = jwt.sign(
        { sub: userDetail._id, type: "Refresh" },
        AppConfig.jwtSecret,
        { expiresIn: "4h" },
      );

      return res.json({
        status: "LOGIN_SUCCESS",
        message: "Login successful",
        data: { accessToken, refreshToken },
      });
    } catch (err) {
      next(err);
    }
  };
  profile = async (req, res, next) => {
    try {
      res.json({
        data: req.loggedInUser,
        status: "YOUR_PROFILE",
      });
    } catch (exception) {
      next(exception);
    }
  };
  forgetPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await authSvc.getSingleRowByFilter({ email });

      if (!user) {
        throw {
          code: 404,
          message: "User not found",
          status: "USER_NOT_FOUND",
        };
      }

      await authSvc.sendForgetPasswordEmail(user);

      res.json({
        message: "Forget password link sent",
        status: "FORGET_PASSWORD_SENT",
      });
    } catch (err) {
      next(err);
    }
  };
  // RESET PASSWORD
  resetPassword = async (req, res, next) => {
    try {
      const { password, confirmPassword } = req.body;
      const token = req.params.token;

      if (password !== confirmPassword) {
        throw {
          code: 400,
          status: "PASSWORD_MISMATCH",
          message: "Passwords do not match",
        };
      }

      // 1. verify JWT
      const decoded = jwt.verify(token, AppConfig.jwtSecret);

      if (decoded.type !== "ForgetPassword") {
        throw {
          code: 403,
          status: "INVALID_TOKEN",
          message: "Invalid token",
        };
      }

      // 2. hash token
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // 3. find user
      const user = await authSvc.getSingleRowByFilter({
        _id: decoded.sub,
        forgetPasswordToken: hashedToken,
      });

      if (!user) {
        throw {
          code: 404,
          status: "TOKEN_INVALID",
          message: "Invalid token",
        };
      }

      // 4. expiry check
      if (user.forgetPasswordExpiry < Date.now()) {
        throw {
          code: 410,
          status: "TOKEN_EXPIRED",
          message: "Token expired",
        };
      }

      // 5. update password
      const bcrypt = require("bcryptjs");

      await authSvc.updateOneRowByFilter(
        { _id: user._id },
        {
          password: bcrypt.hashSync(password, 12),
          forgetPasswordToken: null,
          forgetPasswordExpiry: null,
        },
      );

      res.json({
        message: "Password reset successful",
        status: "PASSWORD_RESET_SUCCESS",
      });
    } catch (err) {
      next(err);
    }
  };
  updateProfile = async (req, res, next) => {
    try {
      if (!req.loggedInUser) {
        return res.status(401).json({
          message: "Unauthorized",
          status: "UNAUTHORIZED",
        });
      }

      const userId = req.loggedInUser._id;

      const allowedFields = ["name", "phone", "address"];
      const payload = {};

      const body = req.body || {};

      // 1. normal fields update
      Object.keys(body).forEach((key) => {
        if (allowedFields.includes(key)) {
          payload[key] = body[key];
        }
      });

      // 2. image upload (NO DELETE EVER)
      if (req.file) {
        const cloudinary = require("cloudinary").v2;

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "ecom-auth",
        });

        const newImage = {
          url: result.secure_url,
          optimizedUrl: result.secure_url,
          isActive: true,
          createdAt: new Date(),
        };

        // deactivate previous images + add new one
        await AuthModel.updateOne(
          { _id: userId },
          {
            $set: {
              "images.$[].isActive": false,
            },
          },
        );

        payload.$push = {
          images: newImage,
        };
      }

      const updateUser = await AuthModel.findByIdAndUpdate(userId, payload, {
        new: true,
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        data: updateUser,
      });
    } catch (err) {
      next(err);
    }
  };
}
const authCtrl = new AuthController();
module.exports = authCtrl;
