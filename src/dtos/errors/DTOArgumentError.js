
/**
 * @class DTOArgumentError
 * @classdesc Error indicating that a DTO's argument is incorrect
 * @extends Error
 */
class DTOArgumentError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'DTOArgumentError'
    }
}

export default DTOArgumentError;
