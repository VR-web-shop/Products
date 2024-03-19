
/**
 * @class SDKFetchError
 * @classdesc Error indicating that a SDK method had an error fetching data 
 * @extends Error
 */
class SDKFetchError extends Error {
    constructor(msg, statusCode) {
        super(msg)
        this.name = 'SDKFetchError'
        this.statusCode = statusCode
    }
}

export default SDKFetchError;
