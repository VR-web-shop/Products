import ProductRequest from '../../src/dtos/ProductRequest.js';
import ProductResponse from '../../src/dtos/ProductResponse.js';
import crudAPI from '../crudAPI.js';

const FOREIGN_KEY = 'uuid';
const ENTITIES_KEY = 'products';
const ENDPOINT_SINGLE = 'admin/product';
const ENDPOINT_MULTIPLE = 'admin/products';
const REQUEST = ProductRequest;
const RESPONSE = ProductResponse;

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
