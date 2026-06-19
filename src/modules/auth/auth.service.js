const AuthModel = require("./auth.model");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const { UserStatus } = require("../../config/constants");
const { randomStringGenerate } = require("../../utilities/helpers");
const emailSvc = require("../../services/email.service");
const { AppConfig } = require("../../config/config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
class AuthService extends BaseService {
  transformAuthData = async (req) => {
    let payload = req.body;

    // password hash
    payload.password = bcrypt.hashSync(payload.password, 12);

    // default image
    payload.image = {
      url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      optimizedUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    };

    // cloudinary upload
    if (req.file) {
      payload.image = await cloudinarySvc.uploadFile(
        req.file.path,
        "ecom-auth"
      );
    }

    // activation system
    payload.status = "inactive";
    payload.activationCode = crypto.randomBytes(32).toString("hex");

    return payload;
  };

  sendActivationEmail = async (user) => {
    const link = `${AppConfig.frontUrl}activate/${user.activationCode}`;

    await emailSvc.sendEmail({
      to: user.email,
      sub: "Activate Your Account",
      message: `
        <h2>Hello ${user.name}</h2>
        <p>Click below to activate your account:</p>
        <a href="${link}">Activate Account</a>
      `,
    });
  };

  activationNotify = async (auth) => {
    try {
      await emailSvc.sendEmail({
        to: auth.email,
        sub: "Activate Your Account",
        message: `
        <h2>Welcome ${auth.name}</h2>
        <p>Your email: ${auth.email}</p>

        <p>Please activate your account by clicking below link:</p>

        <a href="${AppConfig.frontUrl}activate/${auth.activationCode}">
          Activate Account
        </a>

        <p>
          ${AppConfig.frontUrl}activate/${auth.activationCode}
        </p>
      `,
      });
    } catch (exception) {
      throw exception;
    }
  };

  notifyActivationSuccess = async (auth) => {
    try {
      return await emailSvc.sendEmail({
        to: auth.email,
        sub: "🎉 Account Activated Successfully",
        message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello ${auth.name || "User"},</h2>

          <p>Congratulations! 🎉</p>

          <p>Your account has been <strong>successfully activated</strong>. You can now log in and start using all the features available on our platform.</p>

          <p>If you did not request this activation, please contact our support team immediately.</p>

          <br>

          <p>Thank you for choosing us!</p>

          <p>
            Best Regards,<br>
            <strong>Your Company Name</strong>
          </p>
        </div>
      `,
      });
    } catch (exception) {
      throw exception;
    }
  };
  getUserPublicProfile = async (user) => {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      address: user.address,
      image: user.image,
      status: user.status,
    };
  };
  sendForgetPasswordEmail = async (user) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        {
          sub: user._id,
          type: "ForgetPassword",
        },
        AppConfig.jwtSecret,
        {
          expiresIn: "15m",
        },
      );

      // Hash token
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Update user directly
      const updated = await AuthModel.findByIdAndUpdate(
        user._id,
        {
          $set: {
            forgetPasswordToken: hashedToken,
            forgetPasswordExpiry: new Date(Date.now() + 15 * 60 * 1000),
          },
        },
        {
          returnDocument: "after",
        },
      );

      // Reset link
      const resetLink = `${AppConfig.frontUrl}reset-password/${token}`;

      // Send email
      await emailSvc.sendEmail({
        to: user.email,
        sub: "Reset Password",
        message: `
        <h2>Hello ${user.name}</h2>

        <p>Click the link below to reset your password:</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 15 minutes.</p>
      `,
      });

      return true;
    } catch (err) {
      throw err;
    }
  };
}
const authSvc = new AuthService(AuthModel);
module.exports = authSvc;
