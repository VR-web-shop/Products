'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ValutaSettings', [
      { client_side_uuid: 'aaa-bbb-ccc' },
      { client_side_uuid: 'ddd-eee-fff' },
      { client_side_uuid: 'ggg-hhh-iii' }
    ], {});

    await queryInterface.bulkInsert('ValutaSettingDescriptions', [
      { name: 'Euro', short: 'EUR', symbol: '€', active: false, valuta_setting_client_side_uuid: 'aaa-bbb-ccc' },
      { name: 'US Dollar', short: 'USD', symbol: '$', active: false, valuta_setting_client_side_uuid: 'ddd-eee-fff' },
      { name: 'British Pound', short: 'GBP', symbol: '£', active: false, valuta_setting_client_side_uuid: 'ggg-hhh-iii' },
      { name: 'Danish Krone', short: 'DKK', symbol: 'kr', active: true, valuta_setting_client_side_uuid: 'hhh-iii-jjj' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ValutaSettings', null, {});
    await queryInterface.bulkDelete('ValutaSettingDescriptions', null, {});
  }
};
