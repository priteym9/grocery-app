"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  products.init(
    {
      title: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      discount_type: DataTypes.INTEGER,
      discount_amount: DataTypes.FLOAT,
      avatar_image: DataTypes.STRING,
      images: DataTypes.BLOB,
      short_description: DataTypes.STRING,
      description: DataTypes.TEXT,
      slug: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "products",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return products;
};
