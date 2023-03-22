'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Orders.init({
    customer_id: DataTypes.INTEGER,
    delivery_address_id: DataTypes.INTEGER,
    shipping_address_id: DataTypes.INTEGER,
    payment_status: DataTypes.INTEGER,
    order_status: DataTypes.INTEGER,
    order_number: DataTypes.STRING,
    order_date: DataTypes.DATE,
    special_note: DataTypes.STRING,
    estimate_delivery_date: DataTypes.DATE,
    sub_total: DataTypes.FLOAT,
    tax_amount: DataTypes.FLOAT,
    discount_amount: DataTypes.FLOAT,
    total_amount: DataTypes.FLOAT,
    paid_amount: DataTypes.FLOAT,
    payment_type: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Orders',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  });
  return Orders;
};