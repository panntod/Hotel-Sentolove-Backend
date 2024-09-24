"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class kamar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      kamar.belongsTo(models.tipe_kamar, {
        foreignKey: "id_tipe_kamar",
        as: "tipe_kamar",
      });
    }
  }
  kamar.init(
    {
      id_kamar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nomor_kamar: DataTypes.INTEGER,
      id_tipe_kamar: DataTypes.INTEGER,
      check_in: DataTypes.DATE,
      check_out: DataTypes.DATE,
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
