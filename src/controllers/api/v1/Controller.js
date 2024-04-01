import meteor from "@vr-web-shop/meteor";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";

import Product from "../../../models/Product.js";
import ProductEntity from "../../../models/ProductEntity.js";
import ProductEntityState from "../../../models/ProductEntityState.js";

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
        },
        delete: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('products:delete')
            ],
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
        },
        delete: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('product-entities:delete')
            ],
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
}
