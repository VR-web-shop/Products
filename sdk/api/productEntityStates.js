import ProductEntityStateRequest from '../../src/dtos/ProductEntityStateRequest.js';
import ProductEntityStateResponse from '../../src/dtos/ProductEntityStateResponse.js';
import crudAPI from '../crudAPI.js';

const FOREIGN_KEY = 'name';
const ENTITIES_KEY = 'product_entity_states';
const ENDPOINT_SINGLE = 'admin/product_entity_states';
const ENDPOINT_MULTIPLE = 'admin/product_entity_states';
const REQUEST = ProductEntityStateRequest;
const RESPONSE = ProductEntityStateResponse;

async function find(findRequest) {
    return crudAPI.find(
        findRequest, 
        FOREIGN_KEY, 
        REQUEST.FindRequest, 
        RESPONSE, 
        ENDPOINT_SINGLE
    );
}

async function findAll(findAllRequest) {
    return crudAPI.findAll(
        findAllRequest,
        ENTITIES_KEY,
        REQUEST.FindAllRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

export default {
    find,
    findAll
}
