import DTO from './DTO.js';

/**
 * @class FindRequest
 * @classdesc FindRequest class is a DTO class that
 * represents the find request of the product entity.
 * @property {string} uuid The uuid of the product entity.
 */
class FindRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} body The body object.
     * @throws {DTOArgumentError} If the body is not provided.
     * @throws {DTORequestParameterError} If the body does not have a uuid.
     */
    constructor(body) {
        super(body, ['uuid'], ['uuid'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class FindAllRequest
 * @classdesc FindAllRequest class is a DTO class that
 * represents the find all request of the product entity.
 * @property {number} page The page number.
 * @property {number} limit The limit of items per page.
 */
class FindAllRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} quries The quries object.
     * @throws {DTOArgumentError} If the quries is not provided.
     * @throws {DTORequestParameterError} If the page is not a positive integer.
     * @throws {DTORequestParameterError} If the limit is not a positive integer.
     */
    constructor(quries) {
        super(quries, ['page', 'limit'], ['limit'], DTO.TYPES.REQUEST);

        this.limit = parseInt(this.limit);

        if (this.limit < 0) {
            throw new DTORequestParameterError('limit must be a positive integer');
        }

        if (this.page) {
            this.page = parseInt(this.page); 
        }

        if (this.page && this.page < 0) {
            throw new DTORequestParameterError('page must be a positive integer');
        }
    }
}

/**
 * @class CreateRequest
 * @classdesc CreateRequest class is a DTO class that
 * represents the create request of the product entity.
 * @property {string} productUuid The uuid of the product.
 */
class CreateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} body The body object.
     * @throws {DTOArgumentError} If the body is not provided.
     * @throws {DTORequestParameterError} If the body does not have a product_uuid.
     */
    constructor(body) {
        super(body, ['product_uuid'], ['product_uuid'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class UpdateRequest
 * @classdesc UpdateRequest class is a DTO class that
 * represents the update request of the product entity.
 * @property {string} uuid The uuid of the product entity.
 * @property {string} productUuid The uuid of the product.
 */
class UpdateRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} body The body object.
     * @throws {DTOArgumentError} If the body is not provided.
     * @throws {DTORequestParameterError} If the body does not have a uuid.
     * @throws {DTORequestParameterError} If the body does not have a product_uuid.
     */
    constructor(body) {
        super(body, ['uuid', 'product_uuid'], ['uuid', 'product_uuid'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class DeleteRequest
 * @classdesc DeleteRequest class is a DTO class that
 * represents the delete request of the product entity.
 * @property {string} uuid The uuid of the product entity.
 */
class DeleteRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} body The body object.
     * @throws {DTOArgumentError} If the body is not provided.
     * @throws {DTORequestParameterError} If the body does not have a uuid.
     */
    constructor(body) {
        super(body, ['uuid'], ['uuid'], DTO.TYPES.REQUEST);
    }
}

export default {
    FindRequest,
    FindAllRequest,
    CreateRequest,
    UpdateRequest,
    DeleteRequest
}
