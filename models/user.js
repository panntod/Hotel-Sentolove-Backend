"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
