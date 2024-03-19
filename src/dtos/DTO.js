import DTOArgumentError from './errors/DTOArgumentError.js';
import DTORequestParameterError from './errors/DTORequestParameterError.js';
import DTOResponseParameterError from './errors/DTOResponseParameterError.js';

const TYPES = {
    REQUEST: 'request',
    RESPONSE: 'response'
}

/**
 * @function DTO
 * @description Data Transfer Object factory
 * @param {Object} body
 * @param {string[]} params
 * @param {string[]} required
 * @param {string} type
 * @returns {function} The DTO function
 * @throws {DTOArgumentError} If params is not an array
 * @throws {DTOArgumentError} If required is not an array
 * @throws {DTOArgumentError} If type is not request or response
 * @example const UserRequest = DTO(['email', 'password'], ['email', 'password']);
 */
class DTOBaseClass {
    constructor(body = {}, params = [], required = [], type = TYPES.REQUEST) {
        if (!Array.isArray(params)) {
            throw new DTOArgumentError('Params must be an array');
        }

        if (!Array.isArray(required)) {
            throw new DTOArgumentError('Required must be an array');
        }

        if (Object.values(TYPES).indexOf(type) === -1) {
            throw new DTOArgumentError('Type must be request or response');
        }

        const ParameterError = type === TYPES.REQUEST
            ? DTORequestParameterError
            : DTOResponseParameterError;

        if (!body) {
            throw new DTOArgumentError('Body is required');
        }

        for (let requiredParam of required) {
            if (body[requiredParam] === undefined || body[requiredParam] === null) {
                throw new ParameterError(`${requiredParam} is required`);
            }
        }

        for (let param in body) {
            if (params.indexOf(param) !== -1) {
                this[param] = body[param];
            }
        }
    }
}

export default {
    DTOBaseClass,
    TYPES
};
