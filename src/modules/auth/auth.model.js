const mongoose = require("mongoose");
const { Gender,UserRole,UserStatus} = require("../../config/constants");

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 50,
      required: true,
    },

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
      enum: [Gender.FEMALE, Gender.MALE, Gender.OTHER],
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
      enum: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER],
      default: UserRole.CUSTOMER,
    },
    activationCode:String,
    status:String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Auth", AuthSchema);
