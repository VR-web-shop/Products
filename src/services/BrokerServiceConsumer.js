import ModelCommandService from './ModelCommandService.js';
import ModelQueryService from './ModelQueryService.js';

import ProductEntityPutCommand from '../commands/ProductEntity/PutCommand.js';
import ProductOrderPutCommand from '../commands/ProductOrder/PutCommand.js';
import ProductOrderEntityPutCommand from '../commands/ProductOrderEntity/PutCommand.js';
import ProductOrderEntityDeleteCommand from '../commands/ProductOrderEntity/DeleteCommand.js';

import ProductOrderEntityReadCollectionQuery from '../queries/ProductOrderEntity/ReadCollectionQuery.js';

const commandService = ModelCommandService();
const queryService = ModelQueryService();

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
    await commandService.invoke(new ProductEntityPutCommand(msg.client_side_uuid, {
        product_entity_state_name: msg.product_entity_state_name,
        product_client_side_uuid: msg.product_client_side_uuid
    }));
}
/**
 * @function onNewProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onNewProductOrder(msg) {
    const { productOrder, productOrderEntities } = msg;
    
    await commandService.invoke(new ProductOrderPutCommand(productOrder.client_side_uuid, {
        name: productOrder.name,
        email: productOrder.email,
        address: productOrder.address,
        city: productOrder.city,
        country: productOrder.country,
        postal_code: productOrder.postal_code,
        deliver_option_client_side_uuid: productOrder.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: productOrder.payment_option_client_side_uuid,
        product_order_state_state_name: productOrder.product_order_state_state_name
    }));

    for (const entity of productOrderEntities) {
        await commandService.invoke(new ProductOrderEntityPutCommand(entity.client_side_uuid, {
            product_order_client_side_uuid: productOrder.client_side_uuid,
            product_entity_client_side_uuid: entity.product_entity_client_side_uuid
        }));
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
    
    while (true) {
        const productOrderEntityRecords = await queryService.invoke(new ProductOrderEntityReadCollectionQuery({
            where: { product_order_client_side_uuid: productOrder.client_side_uuid },
            limit: 1000
        }));
        if (productOrderEntityRecords.length === 0) break;
        for (const entity of productOrderEntityRecords) {
            await commandService.invoke(new ProductOrderEntityDeleteCommand(entity.client_side_uuid));
        }
    }
    
    await commandService.invoke(new ProductOrderPutCommand(productOrder.client_side_uuid, {
        name: productOrder.name,
        email: productOrder.email,
        address: productOrder.address,
        city: productOrder.city,
        country: productOrder.country,
        postal_code: productOrder.postal_code,
        deliver_option_client_side_uuid: productOrder.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: productOrder.payment_option_client_side_uuid,
        product_order_state_state_name: productOrder.product_order_state_state_name
    }));
    
    for (const entity of productOrderEntities) {
        await commandService.invoke(new ProductOrderEntityPutCommand(entity.client_side_uuid, {
            product_order_client_side_uuid: productOrder.client_side_uuid,
            product_entity_client_side_uuid: entity.product_entity_client_side_uuid
        }));
    }
}

export default {
    config,
    onUpdateProductEntity,
    onNewProductOrder,
    onUpdateProductOrder
}
