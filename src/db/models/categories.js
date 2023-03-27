"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  categories.init(
    {
      title: DataTypes.STRING,
      parent_id: DataTypes.INTEGER,
      slug: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "categories",
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
    }
  );
  return categories;
};
