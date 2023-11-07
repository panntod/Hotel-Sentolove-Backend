"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pemesanan", {
      id_pemesanan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      nomor_pemesanan: {
        type: Sequelize.STRING(50),
      },
      nama_pemesan: {
        type: Sequelize.STRING(100),
      },
      email_pemesan: {
        type: Sequelize.STRING(100),
      },
      tgl_pemesanan: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      tgl_check_in: {
        type: Sequelize.DATE,
      },
      tgl_check_out: {
        type: Sequelize.DATE,
      },
      nama_tamu: {
        type: Sequelize.STRING(100),
      },
      jumlah_kamar: {
        type: Sequelize.INTEGER(11),
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "tipe_kamar",
          key: "id_tipe_kamar",
        },
      },
      status_pemesanan: {
        type: Sequelize.ENUM("baru", "check_in", "check_out"),
      },
      id_user: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "user",
          key: "id_user",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pemesanan");
  },
};
