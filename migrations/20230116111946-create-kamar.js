"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kamar", {
      id_kamar: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      nomor_kamar: {
        type: Sequelize.INTEGER(5),
      },
      id_tipe_kamar: {
        type: Sequelize.UUID,
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
