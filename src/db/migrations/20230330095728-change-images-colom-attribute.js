'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'images', {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('products', 'images', {
      type: Sequelize.BLOB,
      allowNull: false,
    });
  }
};
