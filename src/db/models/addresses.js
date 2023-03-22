'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Addresses.init({
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
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Addresses',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  });
  return Addresses;
};