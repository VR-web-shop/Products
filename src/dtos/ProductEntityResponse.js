import DTO from './DTO.js';

/**
 * @class ProductEntityResponse
 * @classdesc ProductEntityResponse class is a DTO class that
 * represents the response of the product entity.
 * @property {string} uuid The uuid of the product entity.
 * @property {string} state The name of the product entity state.
 * @property {string} product_uuid The uuid of the product.
 * @property {string} created_at The date the product entity was created.
 * @property {string} updated_at The date the product entity was updated.
 */
const REQUIRED = ['uuid', 'product_entity_state_name', 'product_uuid', 'created_at', 'updated_at'];
export default class ProductEntityResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} productEntity The product entity object.
     * @throws {DTOArgumentError} If the product entity is not provided.
     * @throws {DTOResponseParameterError} If the product entity does not have a uuid.
     * @throws {DTOResponseParameterError} If the product entity does not have a state.
     * @throws {DTOResponseParameterError} If the product entity does not have a product uuid.
     * @throws {DTOResponseParameterError} If the product entity does not have a created at.
     * @throws {DTOResponseParameterError} If the product entity does not have a updated at.
     */
    constructor(productEntity) {
        super(productEntity, REQUIRED, REQUIRED, DTO.TYPES.RESPONSE);
    }
}
