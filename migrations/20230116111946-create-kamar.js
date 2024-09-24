"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kamar", {
      id_kamar: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11),
      },
      nomor_kamar: {
        type: Sequelize.INTEGER(5),
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "tipe_kamar",
          key: "id_tipe_kamar",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kamar");
  },
};
