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

      role: {
        type: Sequelize.ENUM("ADMIN", "CUSTOMER", "SELLER"),
        defaultValue: "CUSTOMER",
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "INACTIVE",
      },

      gender: {
        type: Sequelize.ENUM("MALE", "FEMALE", "OTHER"),
        allowNull: true,
      },

      phoneCountryCode: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      phoneNumber: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },

      billingAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      shippingAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      optimizedImageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },

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