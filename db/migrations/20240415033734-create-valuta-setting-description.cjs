'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ValutaSettingDescriptions', {
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
      short: {
        type: Sequelize.STRING,
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false
      },
      active: {
        type: Sequelize.BOOLEAN,
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
      valuta_setting_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'ValutaSettings',
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
    await queryInterface.dropTable('ValutaSettingDescriptions');
  }
};