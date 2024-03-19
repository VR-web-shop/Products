
/**
 * @class SDKFetchMissingTokenError
 * @classdesc Error indicating that a SDK method is trying to fetch data with a token,
 * but non has been set, most likely because login() was not called.
 * @extends Error
 */
class SDKFetchMissingTokenError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'SDKFetchMissingTokenError'
    }
}

export default SDKFetchMissingTokenError;
