const mongoose = require("mongoose");
const { Gender, UserRole } = require("../../config/constants");

const AuthSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 50 },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      required: true,
    },

    phone: {
      phone_countryCode: Number,
      phone_number: Number,
    },

    address: {
      billing: String,
      shipping: String,
    },

    image: {
      url: String,
      optimizedUrl: String,
    },

    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER],
      default: UserRole.CUSTOMER,
    },

    activationCode: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },

    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Auth", AuthSchema);
