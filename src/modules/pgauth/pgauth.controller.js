const cloudinarySvc = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const emailSvc = require("../../services/email.service");
const { randomStringGenerate } = require("../../utilities/helpers");
const { UserStatus } = require("../../config/constants");
const { User } = require("./pg.model");

class PGAuthController {
  registerUser = async (req, res, next) => {
    try {
      const { file, body: payload } = req;

      // =====================
      // 1. VALIDATION GUARD (FILE CHECK)
      // =====================
      if (!file) {
        return res.status(400).json({
          message: "Image is required",
          status: "FILE_MISSING",
        });
      }

      // =====================
      // 2. UPLOAD IMAGE
      // =====================
      const image = await cloudinarySvc.uploadFile(
        file.path,
        "auth/"
      );

      // =====================
      // 3. HASH PASSWORD
      // =====================
      const hashedPassword = bcrypt.hashSync(payload.password, 10);

      // =====================
      // 4. SYSTEM GENERATED DATA
      // =====================
      const systemData = {
        status: UserStatus.INACTIVE,
        activationCode: randomStringGenerate(100),
      };

      // =====================
      // 5. CREATE USER (SAFE MAPPING)
      // =====================
      const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: payload.role,
        gender: payload.gender,

        phoneCountryCode: payload.phoneCountryCode,
        phoneNumber: payload.phoneNumber,

        billingAddress: payload.billingAddress,
        shippingAddress: payload.shippingAddress,

        imageUrl: image?.url || null,
        optimizedImageUrl: image?.optimizedUrl || null,

        ...systemData,
      });

      // =====================
      // 6. EMAIL NOTIFICATION
      // =====================
      await emailSvc.sendEmail({
        to: payload.email,
        sub: "Account Registration Successful",
        message: `
          <h1>Welcome to our system 🎉</h1>
          <p>Your account has been created successfully.</p>
        `,
      });

      // =====================
      // 7. RESPONSE
      // =====================
      return res.status(201).json({
        message: "User registered successfully",
        status: "REGISTERED_SUCCESS",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PGAuthController();