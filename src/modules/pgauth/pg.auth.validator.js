const Joi = require("joi");

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_\-=<>|])[A-Za-z\d~!@#$%^&*()_\-=<>|]{8,}$/;

const pgAuthValidatorDTO = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Password mismatch",
      "string.empty": "Confirm password is required",
    }),

  role: Joi.string()
    .valid("ADMIN", "CUSTOMER", "SELLER")
    .default("CUSTOMER"),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").optional(),

  phoneCountryCode: Joi.number().integer().optional(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be 10–15 digits",
    }),

  billingAddress: Joi.string().optional(),
  shippingAddress: Joi.string().optional(),
});


const pgLoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { pgAuthValidatorDTO,pgLoginDTO };