import ProductRequest from "../src/dtos/ProductRequest.js";
import ProductResponse from "../src/dtos/ProductResponse.js";
import ProductEntityRequest from "../src/dtos/ProductEntityRequest.js";
import ProductEntityResponse from "../src/dtos/ProductEntityResponse.js";
import ProductEntityStateRequest from "../src/dtos/ProductEntityStateRequest.js";
import ProductEntityStateResponse from "../src/dtos/ProductEntityStateResponse.js";

import SDKFetchError from "./errors/SDKFetchError.js";
import SDKFetchMissingTokenError from "./errors/SDKFetchMissingTokenError.js";
import DTOArgumentError from "../src/dtos/errors/DTOArgumentError.js";
import DTORequestParameterError from "../src/dtos/errors/DTORequestParameterError.js";
import DTOResponseParameterError from "../src/dtos/errors/DTOResponseParameterError.js";
import fetchAPI from "./fetchAPI.js";

import products from "./api/products.js";
import productEntities from "./api/productEntities.js";
import productEntityStates from "./api/productEntityStates.js";

/**
 * @function SDK
 * @description The SDK constructor
 * @param {string} serverURL The server URL
 * @param {string} APIVersion The API version
 * @param {object} options The options
 * @param {object} options The options
 * @returns {object} The SDK object
 * @throws {Error} If serverURL is not provided
 * @example const s = new SDK('http://localhost:3002', 'v1', 'http://localhost:3003', 'v1', { authTokenKey: 'auth', authRefreshMethod: () => {} });
 */
const SDK = function(serverURL, APIVersion = 'v1', AuthServerURL = '', AuthAPIVersion = 'v1', options={}) {
    if (!serverURL) {
        throw new Error('serverURL is required');
    }

    fetchAPI.setServerURL(serverURL);
    fetchAPI.setAPIVersion(APIVersion);
    fetchAPI.setAuthServerURL(AuthServerURL);
    fetchAPI.setAuthAPIVersion(AuthAPIVersion);

    if (options.authTokenKey) {
        fetchAPI.setAuthTokenKey(options.authTokenKey);
    }

    /**
     * @property {function} request The SDK fetch request
     * @param {string} endpoint The endpoint to fetch (without the '/' at the beginning)
     * @param {object} options The fetch options
     * @param {boolean} useAuth Whether to use authentication or not
     * @param {number} refreshes The number of times the token has been refreshed in the same request (Note: Used internally by the SDK, do not use it directly)
     * @returns {Promise<Response>} The fetch response
     * @throws {SDKFetchError} If the fetch fails
     * @example const response = await s.request('user', { method: 'GET' }, true);
     */
    this.request = fetchAPI.request;

    /**
     * @property {object} token The SDK token utilities
     */
    this.token = {
        get: fetchAPI.getAuthToken
    }
    
    /**
     * @property {object} api The SDK API utilities
     */
    this.api = {
        products,
        productEntities,
        productEntityStates
    }

    /**
     * @property {object} requests The SDK API requests
     */
    this.requests = {
        ProductRequest,
        ProductEntityRequest,
        ProductEntityStateRequest
    }

    /**
     * @property {object} responses The SDK API responses
     */
    this.responses = {
        ProductResponse,
        ProductEntityResponse,
        ProductEntityStateResponse
    }

    /**
     * @property {object} errors The SDK errors
     */
    this.errors = {
        SDKFetchError,
        SDKFetchMissingTokenError,
        DTOArgumentError,
        DTORequestParameterError,
        DTOResponseParameterError
    }
}

export default SDK
