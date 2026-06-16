const Joi = require("joi");
const { UserRole } = require("../../config/constants");

const UserRegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match password",
  }),
  phone: Joi.object({
    countryCode: Joi.string(),
    phone: Joi.string().min(10).max(10),
  })
    .allow(null, "")
    .default(null),
  role: Joi.string()
    .valid(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
    .default(UserRole.CUSTOMER),
  address: Joi.object({
    shipping: Joi.string(),
    billing: Joi.string(),
  }),
  gender: Joi.string().regex(/^(male|female|other)$/),
});

module.exports = { UserRegisterDTO };
