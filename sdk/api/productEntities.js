import ProductEntityRequest from '../../src/dtos/ProductEntityRequest.js';
import ProductEntityResponse from '../../src/dtos/ProductEntityResponse.js';
import crudAPI from '../crudAPI.js';

const FOREIGN_KEY = 'uuid';
const ENTITIES_KEY = 'product_entities';
const ENDPOINT_SINGLE = 'product_entities';
const ENDPOINT_MULTIPLE = 'product_entities';
const REQUEST = ProductEntityRequest;
const RESPONSE = ProductEntityResponse;

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

async function create(createRequest) {
    return crudAPI.create(
        createRequest, 
        REQUEST.CreateRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

async function update(updateRequest) {
    return crudAPI.update(
        updateRequest, 
        REQUEST.UpdateRequest, 
        RESPONSE,
        ENDPOINT_MULTIPLE
    );
}

async function destroy(deleteRequest) {
    return crudAPI.destroy(
        deleteRequest, 
        REQUEST.DeleteRequest, 
        ENDPOINT_MULTIPLE
    );
}

export default {
    find,
    findAll,
    create,
    update,
    destroy
}
