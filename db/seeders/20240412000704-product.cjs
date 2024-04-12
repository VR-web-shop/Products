'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const demoProducts = require('../../demo_products.json');
    const CDNUrl = process.env.S3_CDN_URL
    const { products } = demoProducts;
    products.forEach(async product => {
        product.thumbnail_source = CDNUrl + "/" + product.thumbnail_source;
    });

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {});
  }
};
