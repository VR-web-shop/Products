'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ValutaSettings', [
      {
        name: 'Euro',
        short: 'EUR',
        symbol: '€',
        active: false
      },
      {
        name: 'US Dollar',
        short: 'USD',
        symbol: '$',
        active: false
      },
      {
        name: 'British Pound',
        short: 'GBP',
        symbol: '£',
        active: false
      },
      {
        name: 'Danish Krone',
        short: 'DKK',
        symbol: 'kr',
        active: true
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ValutaSettings', null, {});
  }
};
