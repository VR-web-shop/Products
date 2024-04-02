import meteor from "@vr-web-shop/meteor";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";

import Product from "../../../models/Product.js";
import ProductEntity from "../../../models/ProductEntity.js";
import ProductEntityState, { PRODUCT_ENTITY_STATES } from "../../../models/ProductEntityState.js";
import ProductOrder from "../../../models/ProductOrder.js";
import ProductOrderEntity from "../../../models/ProductOrderEntity.js";
import ProductOrderState, { PRODUCT_ORDER_STATES } from "../../../models/ProductOrderState.js";
import DeliverOption, { DELIVER_OPTIONS } from "../../../models/DeliverOption.js";
import PaymentOption, { PAYMENT_OPTIONS } from "../../../models/PaymentOption.js";

import StorageConfig from "../../../config/StorageConfig.js";
import { sendMessage } from "../../../config/BrokerConfig.js";

const prefix = '/api/v1/';
const RestController = meteor.RestController;
const debug = false;

export default {
    ProductController: RestController(`${prefix}products`, 'uuid', Product, {
        find: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
                MiddlewareJWT.AuthorizePermissionJWT('products:show')
            ],
            includes: [
                { endpoint: 'product_entities', model: 'ProductEntity' },
            ]
        },
        findAll: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('products:index')
            ], 
            findProperties: ['uuid', 'name', 'description'],
            whereProperties: ['uuid', 'name', 'description'],
            includes: ['ProductEntity']
        },
        create: { 
            properties: ['name', 'description', 'price'], 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('products:create')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_new_product', entity);
                    sendMessage('shopping_cart_new_product', entity);
                }
            }
        },
        update: {
            properties: ['name', 'description'],
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
                MiddlewareJWT.AuthorizePermissionJWT('products:update')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_update_product', entity)
                    sendMessage('shopping_cart_update_product', entity)
                }
            }
        },
        delete: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('products:delete')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_delete_product', entity)
                    sendMessage('shopping_cart_delete_product', entity)
                }
            }
        },
        upload: {
            fields: ['thumbnail_source'],
            s3: { prefix: 'assets/products/thumbnails/', ...StorageConfig }
        },
        debug
    }),

    ProductEntityController: RestController(`${prefix}product_entities`, 'uuid', ProductEntity, {
        find: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:show')
            ],
            includes: [
                { endpoint: 'product_entity_states', model: 'ProductEntityState' },
            ]
        },
        findAll: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:index')
            ], 
            findProperties: ['uuid', 'product_uuid', 'product_entity_state_name'],
            whereProperties: ['uuid', 'product_uuid', 'product_entity_state_name'],
            includes: ['ProductEntityState']
        },
        create: { 
            properties: ['product_uuid', 'product_entity_state_name'], 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:create')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_new_product_entity', entity)
                    sendMessage('shopping_cart_new_product_entity', entity)
                }
            }
        },
        update: {
            properties: ['product_entity_state_name'],
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:update')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_update_product_entity', entity)
                    sendMessage('shopping_cart_update_product_entity', entity)
                }
            }
        },
        delete: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:delete')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('scenes_delete_product_entity', entity)
                    sendMessage('shopping_cart_delete_product_entity', entity)
                }
            }
        },
        debug
    }),

    ProductEntityStateController: RestController(`${prefix}product_entity_states`, 'name', ProductEntityState, {
        find: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
                MiddlewareJWT.AuthorizePermissionJWT('product-entity-states:show')
            ],
        },
        findAll: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-entity-states:index')
            ], 
            findProperties: ['name'],
            whereProperties: ['name'],
        },
        debug
    }),

    ProductOrderController: RestController(`${prefix}product_orders`, 'uuid', ProductOrder, {
        find: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-orders:show')
            ],
            includes: [
                { endpoint: 'product_order_entities', model: 'ProductOrderEntities' },
                { endpoint: 'product_order_states', model: 'ProductOrderState' },
                { endpoint: 'deliver_options', model: 'DeliverOption' },
                { endpoint: 'payment_options', model: 'PaymentOption' },
                { endpoint: 'product_entities', model: 'ProductEntities' }
            ]
        },
        findAll: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-orders:index')
            ],
            findProperties: ['uuid', 'cart_uuid', 'product_order_state_name'],
            whereProperties: ['uuid', 'cart_uuid', 'product_order_state_name'],
            includes: ['ProductOrderState', 'ProductOrderEntity'],
        },
        update: {
            properties: ['name', 'email', 'address', 'city', 'country', 'product_order_state_name', 'postal_code', 'deliver_option_name', 'payment_option_name', 'cart_uuid'],
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-orders:update')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    if (entity.product_order_state_name === PRODUCT_ORDER_STATES.DISCARDED_BY_EMPLOYEE) {
                        const productOrderEntities = await ProductOrderEntity.findAll({ where: { product_order_uuid: entity.uuid } })
                        const productEntities = await ProductEntity.findAll({ where: { uuid: productOrderEntities.map(poe => poe.product_entity_uuid) } })
                        for (const productEntity of productEntities) {
                            await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.AVAILABLE_FOR_PURCHASE })
                            sendMessage('scenes_update_product_entity', productEntity)
                            sendMessage('shopping_cart_update_product_entity', productEntity)
                        }
                    }

                    else if (entity.product_order_state_name === PRODUCT_ORDER_STATES.SHIPPED_TO_CUSTOMER) {
                        const productOrderEntities = await ProductOrderEntity.findAll({ where: { product_order_uuid: entity.uuid } })
                        const productEntities = await ProductEntity.findAll({ where: { uuid: productOrderEntities.map(poe => poe.product_entity_uuid) } })
                        for (const productEntity of productEntities) {
                            await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.SHIPPED_TO_CUSTOMER })
                            sendMessage('scenes_update_product_entity', productEntity)
                            sendMessage('shopping_cart_update_product_entity', productEntity)
                        }
                    }

                    else if (entity.product_order_state_name === PRODUCT_ORDER_STATES.DELIVERED_TO_CUSTOMER) {
                        const productOrderEntities = await ProductOrderEntity.findAll({ where: { product_order_uuid: entity.uuid } })
                        const productEntities = await ProductEntity.findAll({ where: { uuid: productOrderEntities.map(poe => poe.product_entity_uuid) } })
                        for (const productEntity of productEntities) {
                            await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.DELIVERED_TO_CUSTOMER })
                            sendMessage('scenes_update_product_entity', productEntity)
                            sendMessage('shopping_cart_update_product_entity', productEntity)
                        }
                    }

                    sendMessage('shopping_cart_update_product_order', entity)
                }
            }
        },
        delete: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-orders:delete')
            ],
            hooks: {
                after: async (req, res, params, entity) => {
                    sendMessage('shopping_cart_delete_product_order', entity)
                }
            }
        },
        debug
    }),

    ProductOrderEntityController: RestController(`${prefix}product_order_entities`, 'uuid', ProductOrderEntity, {
        find: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-order-entities:show')
            ],
            includes: ['ProductOrder', 'ProductEntity'],
        },
        findAll: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-order-entities:index')
            ],
            findProperties: ['uuid', 'product_order_uuid'],
            whereProperties: ['uuid', 'product_order_uuid'],
            includes: ['ProductOrder', 'ProductEntity'],
        },
        debug
    }),

    ProductOrderStateController: RestController(`${prefix}product_order_states`, 'name', ProductOrderState, {
        find: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-order-states:show')
            ],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-order-states:index')
            ],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),

    DeliverOptionController: RestController(`${prefix}deliver_options`, 'name', DeliverOption, {
        find: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('deliver-options:show')
            ],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('deliver-options:index')
            ],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),

    PaymentOptionController: RestController(`${prefix}payment_options`, 'name', PaymentOption, {
        find: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('payment-options:show')
            ],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('payment-options:index')
            ],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),
}
