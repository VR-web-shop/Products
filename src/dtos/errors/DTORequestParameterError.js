import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class DTORequestParameterError
 * @classdesc Error indicating that a request DTO's parameter is incorrect
 * @extends APIActorError
 */
class DTORequestParameterError extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 400)
        this.name = 'DTORequestParameterError'
    }
}

export default DTORequestParameterError;
