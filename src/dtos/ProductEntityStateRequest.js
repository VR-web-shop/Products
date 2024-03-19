import DTO from './DTO.js';

/**
 * @class FindRequest
 * @classdesc FindRequest class is a DTO class that
 * represents the find request of the product entity.
 * @property {string} uuid The uuid of the product entity state.
 */
class FindRequest extends DTO.DTOBaseClass {

    /**
     * @constructor
     * @param {Object} body The body object.
     * @throws {DTOArgumentError} If the body is not provided.
     * @throws {DTORequestParameterError} If the body does not have a name.
     */
    constructor(body) {
        super(body, ['name'], ['name'], DTO.TYPES.REQUEST);
    }
}

/**
 * @class FindAllRequest
 * @classdesc FindAllRequest class is a DTO class that
 * represents the find all request of the product entity state.
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

        if (this.limit < 0) {
            throw new DTORequestParameterError('limit must be a positive integer');
        }

        if (this.page && this.page < 0) {
            throw new DTORequestParameterError('page must be a positive integer');
        }
    }
}

export default {
    FindRequest,
    FindAllRequest
}
