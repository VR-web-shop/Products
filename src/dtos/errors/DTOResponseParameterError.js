
/**
 * @class DTOResponseParameterError
 * @classdesc Error indicating that a response DTO's parameter is incorrect
 * @extends Error
 */
class DTOResponseParameterError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'DTOResponseParameterError'
    }
}

export default DTOResponseParameterError;
