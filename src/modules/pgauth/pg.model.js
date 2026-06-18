const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/pg.config");
const { UserRole, Gender, UserStatus } = require("../../config/pgConstants");

const User = sequelize.define(
  "User",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
      defaultValue: UserRole.CUSTOMER,
    },

    status: {
      type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.INACTIVE),
      defaultValue: UserStatus.INACTIVE,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM(Gender.MALE, Gender.FEMALE, Gender.OTHER),
      allowNull: true,
    },

    phoneCountryCode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    billingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    optimizedImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    activationCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    forgetPasswordCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    expiryDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

module.exports = User;