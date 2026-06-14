const Joi = require('joi');
const { UserRole } = require("../../config/constants");

const pgAuthValidatorDTO = Joi.object({
  name: Joi.string().max(50).min(2).required(),
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

module.exports = { pgAuthValidatorDTO };
