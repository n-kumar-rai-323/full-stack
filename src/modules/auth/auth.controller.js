const User = require("./auth.model");
class authController {
  async register(req, res, next) {
    try {
      const payload = req.body;

      if (!payload.email || !payload.password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const existingUser = await User.findOne({ email: payload.email });

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const newUser = await User.create(payload);
      return res.status(201).json({
        message: "User created successfully",
        user: newUser,
      });
    } catch (error) {
      next(error);
    }
  }
  async getUsersAll(req,res,next){
    try{
      const users = await User.find();
      return res.json({
        data:users,
        message:"All users retrieved successfully",
        status:"success",
      })
    }catch(exception){
      next(exception)
    }
  }
}
const authCtrl = new authController();
module.exports = authCtrl;
