const cloudinarySvc = require("../../services/cloudinary.service");

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      let payload = req.body;

      if (!req.file) {
        return next({
          code: 400,
          message: "No file uploaded",
          status: "FILE_REQUIRED",
        });
      }

      let image = await cloudinarySvc.uploadFile(req.file.path, "user/");

      res.json({
        data: { payload, image },
      });

    } catch (err) {
      next(err);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;