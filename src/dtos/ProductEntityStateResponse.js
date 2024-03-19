import DTO from './DTO.js';

/**
 * @class ProductEntityStateResponse
 * @classdesc ProductEntityStateResponse class is a DTO class that 
 * represents the response of the product entity state.
 * @property {string} name The name of the product entity state.
 */
export default class ProductEntityStateResponse extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} productEntityState The product entity state object.
     * @throws {DTOArgumentError} If the product entity state is not provided.
     * @throws {DTOResponseParameterError} If the product entity state does not have a name.
     */
    constructor(productEntityState) {
        super(productEntityState, ['name'], ['name'], DTO.TYPES.RESPONSE);
    }
}
