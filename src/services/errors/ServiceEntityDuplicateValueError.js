import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ServiceEntityDuplicateValueError
 * @classdesc Error indicating that a service could not create an entity 
 * because a duplicate value was found on a unique field
 * @extends APIActorError
 */
class ServiceEntityDuplicateValueError extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 400)
        this.name = 'ServiceEntityDuplicateValueError'
    }
}

export default ServiceEntityDuplicateValueError;
