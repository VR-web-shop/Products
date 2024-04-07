import 'dotenv/config'
import database from './src/models/Database.js';

import Product from './src/models/Product.js';
import ProductEntity from './src/models/ProductEntity.js';
import ProductEntityState, { PRODUCT_ENTITY_STATES } from './src/models/ProductEntityState.js';
import ProductOrder from './src/models/ProductOrder.js';
import ProductOrderState, { PRODUCT_ORDER_STATES } from './src/models/ProductOrderState.js';
import ProductOrderEntity from './src/models/ProductOrderEntity.js';
import DeliverOption, { DELIVER_OPTIONS } from './src/models/DeliverOption.js';
import PaymentOption, { PAYMENT_OPTIONS } from './src/models/PaymentOption.js';
import ValutaSetting, { VALUTA_SETTINGS } from './src/models/ValutaSetting.js';

import demoProducts from './demo_products.json' assert { type: "json" };

(async () => {
    await database.sync({ force: true });

    Object.values(PRODUCT_ENTITY_STATES).forEach(async name => {
        await ProductEntityState.findOrCreate({ where: { name } });
    });

    Object.values(PRODUCT_ORDER_STATES).forEach(async name => {
        await ProductOrderState.findOrCreate({ where: { name } });
    });

    Object.values(DELIVER_OPTIONS).forEach(async option => {
        await DeliverOption.findOrCreate({ where: option });
    });

    Object.values(PAYMENT_OPTIONS).forEach(async option => {
        await PaymentOption.findOrCreate({ where: option });
    });

    Object.values(VALUTA_SETTINGS).forEach(async setting => {
        await ValutaSetting.findOrCreate({ where: setting });
    });

    const CDNUrl = process.env.S3_CDN_URL
    const { products } = demoProducts;
    products.forEach(async product => {
        product.thumbnail_source = CDNUrl + "/" + product.thumbnail_source;
        await Product.create(product);
    });
})();
