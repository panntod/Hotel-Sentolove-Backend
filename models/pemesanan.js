"use strict";

const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    static associate(models) {
      pemesanan.hasMany(models.detail_pemesanan, {
        foreignKey: "id_pemesanan",
        as: "detail_pemesanan",
      });
      pemesanan.belongsTo(models.user, {
        foreignKey: "id_user",
        as: "user",
      });
      pemesanan.belongsTo(models.tipe_kamar, {
        foreignKey: "id_tipe_kamar",
        as: "tipe_kamar",
      });
    }
  }
  pemesanan.init(
    {
      id_pemesanan: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      nomor_pemesanan: DataTypes.STRING,
      nama_pemesan: DataTypes.STRING,
      email_pemesan: DataTypes.STRING,
      tgl_pemesanan: DataTypes.DATE,
      tgl_check_in: DataTypes.DATE,
      tgl_check_out: DataTypes.DATE,
      nama_tamu: DataTypes.STRING,
      jumlah_kamar: DataTypes.INTEGER,
      id_tipe_kamar: DataTypes.UUID,
      status_pemesanan: DataTypes.ENUM("baru", "check_in", "check_out"),
      id_user: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "pemesanan",
      tableName: "pemesanan",
      timestamps: false,
    },
  );
  return pemesanan;
};
