"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tipe_kamar", {
      id_tipe_kamar: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nama_tipe_kamar: {
        type: Sequelize.STRING(100),
      },
      harga: {
        type: Sequelize.INTEGER(11),
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      foto: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tipe_kamar");
  },
};
