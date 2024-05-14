'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductOrderDescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      postal_code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('now')
      },
      product_order_state_name: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'ProductOrderStates',
          key: 'name'
        }
      },
      deliver_option_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'DeliverOptions',
          key: 'client_side_uuid'
        }
      },
      payment_option_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'PaymentOptions',
          key: 'client_side_uuid'
        }
      },
      product_order_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'ProductOrders',
          key: 'client_side_uuid'
        }
      },
      distributed_transaction_transaction_uuid: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'DistributedTransactions',
          key: 'transaction_uuid'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductOrderDescriptions');
  }
};