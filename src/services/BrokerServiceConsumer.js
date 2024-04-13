import ProductEntityService from '../services/ProductEntityService.js';
import ProductOrderService from '../services/ProductOrderService.js';
import ProductOrderEntityService from '../services/ProductOrderEntityService.js';

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
    await ProductEntityService.update(
        msg.uuid,
        msg.product_entity_state_name,
        msg.product_uuid
    );
}
/**
 * @function onNewProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onNewProductOrder(msg) {
    const { productOrder, productOrderEntities } = msg;
    
    await ProductOrderService.create(
        productOrder.name,
        productOrder.email,
        productOrder.address,
        productOrder.city,
        productOrder.country,
        productOrder.postal_code,
        productOrder.deliver_option_name,
        productOrder.payment_option_name,
        productOrder.product_order_state_name,
        productOrder.uuid
    );

    for (const entity of productOrderEntities) {
        await ProductOrderEntityService.create(
            entity.product_order_uuid,
            entity.product_entity_uuid,
            entity.uuid
        );
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
    const productOrderEntityRecords = await ProductOrderEntityService.findAllWhere({
        product_order_uuid: productOrder.uuid
    });
    for (const entity of productOrderEntityRecords) {
        await ProductOrderEntityService.remove(entity.uuid);
    }
    
    // Update the product order
    await ProductOrderService.update(
        productOrder.uuid,
        productOrder.name,
        productOrder.email,
        productOrder.address,
        productOrder.city,
        productOrder.country,
        productOrder.postal_code,
        productOrder.deliver_option_name,
        productOrder.payment_option_name,
        productOrder.product_order_state_name
    );
    
    // Create new product order entities
    for (const entity of productOrderEntities) {
        await ProductOrderEntityService.create(
            entity.product_order_uuid,
            entity.product_entity_uuid,
            entity.uuid
        );
    }
}

export default {
    config,
    onUpdateProductEntity,
    onNewProductOrder,
    onUpdateProductOrder
}
