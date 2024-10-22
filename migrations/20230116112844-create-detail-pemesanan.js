"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_pemesanan", {
      id_detail_pemesanan: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      id_pemesanan: {
        type: Sequelize.UUID,
        references: {
          model: "pemesanan",
          key: "id_pemesanan",
        },
      },
      id_kamar: {
        type: Sequelize.UUID,
        references: {
          model: "kamar",
          key: "id_kamar",
        },
      },
      tgl_akses: {
        type: Sequelize.DATE,
      },
      harga: {
        type: Sequelize.INTEGER(11),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("detail_pemesanan");
  },
};
