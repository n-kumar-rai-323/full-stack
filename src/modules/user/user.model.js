const mongoose = require("mongoose");
const { Gender } = require("../../config/constants");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 50,
      required: true,
    },

    gender: {
      type: String,
      enum: [Gender.FEMALE, Gender.MALE, Gender.OTHER],
      required: true,
    },

    phone: {
      countryCode: Number,
      phone: Number,
    },

    address: {
      billing: String,
      shipping: String,
    },

    image: {
      url: String,
      optimizeUrl: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);