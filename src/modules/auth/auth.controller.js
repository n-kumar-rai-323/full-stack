const cloudinarySvc = require("../../services/cloudinary.service");
const bcrypt = require("bcryptjs");
const emailSvc = require("../../services/email.service");
const { UserStatus } = require("../../config/constants");
const { randomStringGenerate } = require("../../utilities/helpers");
const authModel = require("./auth.model");
class AuthController {
  registerUser = async (req, res, next) => {
    try {
      let payload = req.body;

      payload.image = await cloudinarySvc.uploadFile(req.file.path, "auth/");
      payload.password = bcrypt.hashSync(payload.password, 12);
      payload.status = UserStatus.INACTIVE;
      payload.activationCode = randomStringGenerate(100);

      // db store
      const userobje = new authModel(payload);
      await userobje.save();
      // notification
      // await emailSvc.sendEmail({
      //   to:payload.email,
      //   sub:"",

      //   message:"<h1>Hello World</h1>"
      // })

      res.json({
        data: userobje,
        message: "Your account has been registered successfully",
        status: "REGISTERED_SUCCESS",
        options: null,
      });
    } catch (err) {
      next(err);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
