import { sendMessage } from "../config/BrokerConfig.js";

const CONSUMERS = {
    SHOPPING_CART: 'shopping_cart',
    SCENES: 'scenes',
}

const QUEUES = {
    NEW_PRODUCT: 'new_product',
    UPDATE_PRODUCT: 'update_product',
    DELETE_PRODUCT: 'delete_product',
    NEW_PRODUCT_ENTITY: 'new_product_entity',
    UPDATE_PRODUCT_ENTITY: 'update_product_entity',
    DELETE_PRODUCT_ENTITY: 'delete_product_entity',
    UPDATE_PRODUCT_ORDER: 'update_product_order',
    DELETE_PRODUCT_ORDER: 'delete_product_order',
}

/**
 * @function newProduct
 * @param {Object} product
 * @returns {Promise<void>}
 */
async function newProduct(product) {
    const queue = QUEUES.NEW_PRODUCT;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, product);
    }
}

/**
 * @function updateProduct
 * @param {Object} product
 * @returns {Promise<void>}
 */
async function updateProduct(product) {
    const queue = QUEUES.UPDATE_PRODUCT;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, product);
    }
}

/**
 * @function deleteProduct
 * @param {Object} product
 * @returns {Promise<void>}
 */
async function deleteProduct(product) {
    const queue = QUEUES.DELETE_PRODUCT;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, product);
    }
}

/**
 * @function newProductEntity
 * @param {Object} productEntity
 * @returns {Promise<void>}
 */
async function newProductEntity(productEntity) {
    const queue = QUEUES.NEW_PRODUCT_ENTITY;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productEntity);
    }
}

/**
 * @function updateProductEntity
 * @param {Object} productEntity
 * @returns {Promise<void>}
 */
async function updateProductEntity(productEntity) {
    const queue = QUEUES.UPDATE_PRODUCT_ENTITY;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productEntity);
    }
}

/**
 * @function deleteProductEntity
 * @param {Object} productEntity
 * @returns {Promise<void>}
 */
async function deleteProductEntity(productEntity) {
    const queue = QUEUES.DELETE_PRODUCT_ENTITY;
    const consumers = [CONSUMERS.SHOPPING_CART, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productEntity);
    }
}

/**
 * @function updateProductOrder
 * @param {Object} productOrder
 * @returns {Promise<void>}
 */
async function updateProductOrder(productOrder) {
    const queue = QUEUES.UPDATE_PRODUCT_ORDER;
    const consumers = [CONSUMERS.SHOPPING_CART];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productOrder);
    }
}

/**
 * @function deleteProductOrder
 * @param {Object} productOrder
 * @returns {Promise<void>}
 */
async function deleteProductOrder(productOrder) {
    const queue = QUEUES.DELETE_PRODUCT_ORDER;
    const consumers = [CONSUMERS.SHOPPING_CART];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productOrder);
    }
}

export default {
    newProduct,
    updateProduct,
    deleteProduct,
    newProductEntity,
    updateProductEntity,
    deleteProductEntity,
    updateProductOrder,
    deleteProductOrder,
}
