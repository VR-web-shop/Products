import APIActorError from "../../controllers/api/errors/APIActorError.js";

/**
 * @class ServiceEntityNotFound
 * @classdesc Error indicating that a service could not find the requested entity
 * @extends APIActorError
 */
class ServiceEntityNotFound extends APIActorError {

    /**
     * @constructor
     * @param {string} msg - The error message
     */
    constructor(msg) {
        super(msg, 404)
        this.name = 'ServiceEntityNotFound'
    }
}

export default ServiceEntityNotFound;
