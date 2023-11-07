"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_pemesanan", {
      id_detail_pemesanan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      id_pemesanan: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "pemesanan",
          key: "id_pemesanan",
        },
      },
      id_kamar: {
        type: Sequelize.INTEGER(11),
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
