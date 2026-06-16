const Joi = require('joi');
const { UserRole } = require("../../config/constants");

const pgAuthValidatorDTO = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Password mismatch",
    }),

  role: Joi.string().valid("ADMIN", "CUSTOMER", "SELLER").default("CUSTOMER"),

  gender: Joi.string().required(),

  phoneCountryCode: Joi.number().optional(),
  phoneNumber: Joi.number().optional(),

  billingAddress: Joi.string().optional(),
  shippingAddress: Joi.string().optional(),
});
module.exports = { pgAuthValidatorDTO };
