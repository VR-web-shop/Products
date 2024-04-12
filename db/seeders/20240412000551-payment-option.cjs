'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PaymentOptions', [
      {
        name: 'Credit Card',
        price: 0
      },
      {
        name: 'Paypal',
        price: 0
      },
      {
        name: 'Bank Transfer',
        price: 0
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentOptions', null, {});
  }
};