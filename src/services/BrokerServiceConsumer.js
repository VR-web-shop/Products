import ProductEntity from '../models/ProductEntity.js';
import ProductOrder from '../models/ProductOrder.js';
import ProductOrderEntity from '../models/ProductOrderEntity.js';

const TYPES = {
    PRODUCTS_UPDATE_PRODUCT_ENTITY: 'products_update_product_entity',
    PRODUCTS_NEW_PRODUCT_ORDER: 'products_new_product_order',
    PRODUCTS_UPDATE_PRODUCT_ORDER: 'products_update_product_order',
}

const config = [
    { type: TYPES.PRODUCTS_UPDATE_PRODUCT_ENTITY, callback: onUpdateProductEntity },
    { type: TYPES.PRODUCTS_NEW_PRODUCT_ORDER, callback: onNewProductOrder },
    { type: TYPES.PRODUCTS_UPDATE_PRODUCT_ORDER, callback: onUpdateProductOrder },
]

/**
 * @function onUpdateProductEntity
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onUpdateProductEntity(msg) {
    const uuid = msg.uuid;
    const entity = await ProductEntity.findOne({ where: { uuid } });
    await entity.update({
        product_entity_state_name: msg.product_entity_state_name
    });
}
/**
 * @function onNewProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onNewProductOrder(msg) {
    const { productOrder, productOrderEntities } = msg;

    await ProductOrder.create(productOrder);
    for (const entity of productOrderEntities) {
        await ProductOrderEntity.create(entity);
    }
}

/**
 * @function onUpdateProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onUpdateProductOrder(msg) {
    const { productOrder, productOrderEntities } = msg;
    productOrder.ProductOrderStateName = productOrder.product_order_state_name;
    // Delete all product order entities
    await ProductOrderEntity.destroy({ where: { product_order_uuid: productOrder.uuid } });
    // Update the product order
    await ProductOrder.update(productOrder, { where: { uuid: productOrder.uuid } });
    // Create new product order entities
    for (const entity of productOrderEntities) {
        await ProductOrderEntity.create(entity);
    }
}


export default {
    config
}
