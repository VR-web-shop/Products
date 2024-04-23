'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductEntityDescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      product_entity_state_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_entity_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      transaction_state_name: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'TransactionStates',
          key: 'name'
        },
      },
      transaction_message: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductEntityDescriptions');
  }
};