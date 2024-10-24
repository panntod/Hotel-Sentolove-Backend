"use strict";

const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class tipe_kamar extends Model {
    static associate(models) {
      tipe_kamar.hasMany(models.kamar, {
        foreignKey: "id_tipe_kamar",
        as: "kamar",
      });
      tipe_kamar.hasMany(models.pemesanan, {
        foreignKey: "id_tipe_kamar",
        as: "pemesanan",
      });
    }
  }
  tipe_kamar.init(
    {
      id_tipe_kamar: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      nama_tipe_kamar: DataTypes.STRING,
      harga: DataTypes.INTEGER,
      deskripsi: DataTypes.TEXT,
      foto: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "tipe_kamar",
      tableName: "tipe_kamar",
    },
  );
  return tipe_kamar;
};
