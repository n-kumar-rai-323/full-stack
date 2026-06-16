'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      // =====================
      // Identity
      // =====================
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      // =====================
      // Role & Access
      // =====================
      role: {
        type: Sequelize.ENUM("ADMIN", "CUSTOMER", "SELLER"),
        defaultValue: "CUSTOMER",
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "INACTIVE",
      },

      // =====================
      // Profile
      // =====================
      gender: {
        type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
        allowNull: true,
      },

      phone_countryCode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      phone_number: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      billing_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      shipping_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      optimized_image_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // =====================
      // Security
      // =====================
      activationCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      forgetPasswordCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      lastLogin: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // =====================
      // Timestamps
      // =====================
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};