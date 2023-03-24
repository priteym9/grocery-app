'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customers.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    primary_mobile_number: DataTypes.STRING,
    primary_email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    date_of_birth: DataTypes.DATEONLY,
    secondary_mobile_number: DataTypes.STRING,
    secondary_email: DataTypes.STRING,
    customer_type: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
    deleted_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'customers',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
  });
  return customers;
};