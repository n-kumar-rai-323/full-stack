const cloudinarySvc = require("../../services/cloudinary.service");

class PGAuthController {
  registerUser = async(req, res, next) => {
    let payload = req.body;
    let image = await cloudinarySvc.uploadFile(req.file.path, "pguser/");
    res.json({
      data: {payload,image},
    });
  };
}
const PGAuthCtrl = new PGAuthController();
module.exports = PGAuthCtrl;
