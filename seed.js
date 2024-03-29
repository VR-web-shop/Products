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
})();
