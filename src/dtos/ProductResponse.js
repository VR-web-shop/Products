import DTO from './DTO.js';

/**
 * @class ProductResponse
 * @classdesc ProductResponse class is a DTO class that
 * represents the response of the product.
 * @property {string} uuid The uuid of the product.
 * @property {string} name The name of the product.
 * @property {string} description The description of the product.
 * @property {string} created_at The date the product was created.
 * @property {string} updated_at The date the product was updated.
 */
const REQUIRED = ['uuid', 'name', 'description', 'createdAt', 'updatedAt'];
export default class ProductResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} entity The product object.
     * @throws {DTOArgumentError} If the product entity is not provided.
     * @throws {DTOResponseParameterError} If the product entity does not have a uuid.
     * @throws {DTOResponseParameterError} If the product entity does not have a name.
     * @throws {DTOResponseParameterError} If the product entity does not have a description.
     * @throws {DTOResponseParameterError} If the product entity does not have a created at.
     * @throws {DTOResponseParameterError} If the product entity does not have a updated at.
     */
    constructor(product) {
        super(product, REQUIRED, REQUIRED, DTO.TYPES.RESPONSE);
    }
}
