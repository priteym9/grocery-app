"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductCategories.init(
    {
      product_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "ProductCategories",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return ProductCategories;
};
