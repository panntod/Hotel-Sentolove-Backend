"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class detail_pemesanan extends Model {
    static associate(models) {
      // define association here
      detail_pemesanan.belongsTo(models.pemesanan, {
        foreignKey: "id_pemesanan",
        as: "pemesanan",
      });
      detail_pemesanan.belongsTo(models.kamar, {
        foreignKey: "id_kamar",
        as: "kamar",
      });
    }
  }
  detail_pemesanan.init(
    {
      id_detail_pemesanan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_pemesanan: DataTypes.INTEGER,
      id_kamar: DataTypes.INTEGER,
      tgl_akses: DataTypes.DATE,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "detail_pemesanan",
      tableName: "detail_pemesanan",
      timestamps: false,
    },
  );
  return detail_pemesanan;
};
