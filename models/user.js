"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.pemesanan, {
        foreignKey: "id_user",
        as: "pemesanan",
      });
    }
  }
  user.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama_user: DataTypes.STRING,
      foto: DataTypes.TEXT,
      email: DataTypes.STRING,
      password: DataTypes.TEXT,
      role: DataTypes.ENUM("admin", "resepsionis", "tamu"),
    },
    {
      sequelize,
      modelName: "user",
      tableName: "user",
      timestamps: false,
    },
  );
  return user;
};
