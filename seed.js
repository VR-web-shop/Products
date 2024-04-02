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
})();
