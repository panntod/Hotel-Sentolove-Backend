"use strict";

const { v4: uuidv4 } = require("uuid");
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
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
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
    },
  );
  return user;
};
