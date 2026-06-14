const Joi = require('joi');
const { UserRole } = require("../../config/constants");

const UserRegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match password",
  }),
  phone: Joi.string().allow(null, "").default(null),
  role: Joi.string()
    .valid(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
    .default(UserRole.CUSTOMER),
});

module.exports = { UserRegisterDTO };
