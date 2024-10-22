"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class detail_pemesanan extends Model {
    static associate(models) {
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
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      id_pemesanan: DataTypes.UUID,
      id_kamar: DataTypes.UUID,
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
