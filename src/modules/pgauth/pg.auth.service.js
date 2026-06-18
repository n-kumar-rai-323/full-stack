const BaseService = require("../../services/pg.base.service");
const cloudinarySvc = require("../../services/cloudinary.service");
const { randomStringGenerate } = require("../../utilities/helpers");
const { UserStatus } = require("../../config/pgConstants");
const AuthModel = require("./pg.model");
const bcrypt = require("bcryptjs");
const emailSvc = require("../../services/pg.email.service");
const { AppConfig } = require("../../config/config");

class AuthService extends BaseService {
  transformData = async (req) => {
    try {
      let payload = req.body;

      const image = await cloudinarySvc.uploadFile(req.file.path, "auth/");

      return {
        name: payload.name?.trim(),
        email: payload.email,
        password: bcrypt.hashSync(payload.password, 10),
        role: payload.role?.toUpperCase(),
        gender: payload.gender?.toUpperCase(),
        phoneCountryCode: payload.phoneCountryCode,
        phoneNumber: payload.phoneNumber ? Number(payload.phoneNumber) : null,
        billingAddress: payload.billingAddress?.trim(),
        shippingAddress: payload.shippingAddress?.trim(),
        imageUrl: image?.url || null,
        optimizedImageUrl: image?.optimizedUrl || null,
        status: UserStatus.INACTIVE,
        activationCode: randomStringGenerate(100),
      };
    } catch (exception) {
      throw exception;
    }
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
  notifyUserAcctivateSucceffully = async (auth) => {
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
}

const authSvc = new AuthService(AuthModel);
module.exports = authSvc;
