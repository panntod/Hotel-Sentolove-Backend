"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id_user: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama_user: {
        type: Sequelize.STRING(100),
      },
      foto: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING(100),
      },
      password: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.ENUM("admin", "resepsionis", "tamu"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
