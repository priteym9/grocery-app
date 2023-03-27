'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primary_mobile_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: 10
        }
      },
      primary_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      username: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          len: [8, 64]
        }
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        defaultValue: null,
        validate: {
          isDate: true
        },
      },
      secondary_mobile_number: {
        type: Sequelize.STRING(16),
        validate: {
          len: 10
        },
        defaultValue: null
      },
      secondary_email: {
        type: Sequelize.STRING,
        validate: {
          isEmail: true
        },
        defaultValue: null
      },
      customer_type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: [[0, 1, 2]],
        },
        comment: '0: Normal, 1: VIP, 2: VVIP',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('customers');
  }
};