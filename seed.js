import 'dotenv/config'
import database from './src/models/Database.js';

import Product from './src/models/Product.js';
import ProductEntity from './src/models/ProductEntity.js';
import ProductEntityState, { PRODUCT_ENTITY_STATES } from './src/models/ProductEntityState.js';

(async () => {
    await database.sync({ force: true });

    Object.values(PRODUCT_ENTITY_STATES).forEach(async name => {
        await ProductEntityState.findOrCreate({ where: { name } });
    });

    const product = await Product.create({
        name: 'Product 1',
        description: 'Product 1 description'
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.WAITING_FOR_EMPLOYEE_COMPLETION
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.AVAILABLE_FOR_PURCHASE
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.RESERVERED_BY_CUSTOMER_CART
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.RESERVERED_BT_CUSTOMER_ORDER
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.SHIPPED_TO_CUSTOMER
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.DELIVERED_TO_CUSTOMER
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.RETURNED_BY_CUSTOMER
    });

    await ProductEntity.create({
        ProductUuid: product.uuid,
        ProductEntityStateName: PRODUCT_ENTITY_STATES.DISCARDED_BY_EMPLOYEE
    });
})();
