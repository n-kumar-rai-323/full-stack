const Joi = require("joi");
const { UserRole } = require("../../config/constants");

// Clean password regex
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_\-=<>|])[A-Za-z\d~!@#$%^&*()_\-=<>|]{8,}$/;

const UserRegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be less than 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.empty": "Password is required",
    "string.pattern.base":
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
    "any.required": "Password is required",
  }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirm password does not match password",
    "string.empty": "Confirm password is required",
  }),

  phone: Joi.object({
    countryCode: Joi.string().allow("").optional(),
    phone: Joi.string().min(10).max(10).allow("").optional(),
  })
    .allow(null, "")
    .default(null),

  role: Joi.string()
    .valid(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER)
    .default(UserRole.CUSTOMER)
    .messages({
      "any.only": "Invalid user role",
    }),

  address: Joi.object({
    shipping: Joi.string().allow("").optional(),
    billing: Joi.string().allow("").optional(),
  }).optional(),

  gender: Joi.string().valid("male", "female", "other").optional().messages({
    "any.only": "Gender must be male, female, or other",
  }),
});

const LoginDTO = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
module.exports = { UserRegisterDTO, LoginDTO };
