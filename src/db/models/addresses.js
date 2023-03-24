"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class addresses extends Model {
    static associate(models) {
      // define association here
    }
  }
  addresses.init(
    {
      customer_id: DataTypes.INTEGER,
      address_line_1: DataTypes.STRING,
      address_line_2: DataTypes.STRING,
      area: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      landmark: DataTypes.STRING,
      tag: DataTypes.STRING,
      is_default: DataTypes.BOOLEAN,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "addresses",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return addresses;
};
