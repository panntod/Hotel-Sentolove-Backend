"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class kamar extends Model {
    static associate(models) {
      kamar.belongsTo(models.tipe_kamar, {
        foreignKey: "id_tipe_kamar",
        as: "tipe_kamar",
      });
    }
  }
  kamar.init(
    {
      id_kamar: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      nomor_kamar: DataTypes.INTEGER,
      id_tipe_kamar: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "kamar",
      tableName: "kamar",
      timestamps: false,
    },
  );
  return kamar;
};
