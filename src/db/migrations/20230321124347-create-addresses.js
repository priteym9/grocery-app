'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      address_line_1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address_line_2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      area: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      city: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      country: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      postal_code: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      landmark: {
        type: Sequelize.STRING(64),
        allowNull: true
      },
      tag: {
        type: Sequelize.STRING(8),
        allowNull: false,
        defaultValue: 'HOME',
        validate: {
          isIn: [['HOME', 'OFFICE', 'OTHER']]
        }
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    },{
      paranoid: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
  }
};