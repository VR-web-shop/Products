
/**
 * @class ServiceArgumentError
 * @classdesc Error indicating that a service argument is incorrect
 * @extends Error
 */
class ServiceArgumentError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'ServiceArgumentError'
    }
}

export default ServiceArgumentError;
