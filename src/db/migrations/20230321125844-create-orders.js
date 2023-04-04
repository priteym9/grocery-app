'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      delivery_address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      billing_address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      payment_status: {
        type: Sequelize.INTEGER,
        references: {
          model: 'payment_status_masters',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order_status: {
        type: Sequelize.INTEGER,
        references: {
          model: 'order_status_masters',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      order_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      special_note: {
        type: Sequelize.STRING(512),
        allowNull: true,
        defaultValue: null
      },
      estimate_delivery_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
      },
      sub_total: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      tax_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      discount_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      paid_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      payment_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[0, 1, 2, 3]]
        },
        comment: '0: Cash, 1: Card, 2: Wallet, 3: UPI, 4: Net Banking'
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },{
      paranoid: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};