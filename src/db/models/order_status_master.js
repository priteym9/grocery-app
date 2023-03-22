'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Status_Master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order_Status_Master.init({
    title: DataTypes.STRING,
    deleted_at: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order_Status_Master',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  });
  return Order_Status_Master;
};