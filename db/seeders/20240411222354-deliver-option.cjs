'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('DeliverOptions', [
      {
        name: 'Standard Delivery',
        price: 10
      },
      {
        name: 'Express Delivery',
        price: 20
      },
      {
        name: 'Pickup',
        price: 0
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DeliverOptions', null, {});
  }
};
