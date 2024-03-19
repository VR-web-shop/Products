import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFound from "./errors/ServiceEntityNotFound.js";
import ProductRequest from "../dtos/ProductRequest.js";
import ProductResponse from "../dtos/ProductResponse.js";
import Product from "../models/Product.js";

/**
 * @function find
 * @description Finds a product by UUID.
 * @param {ProductRequest.FindRequest} findRequest The find request.
 * @returns {Promise<ProductResponse>} The product.
 * @throws {ServiceArgumentError} If the find request is not provided.
 * @throws {ServiceEntityNotFound} If the product is not found.
 */
async function find(findRequest) {
    if (!(findRequest instanceof ProductRequest.FindRequest)) {
        throw new ServiceArgumentError('findRequest must be an instance of ProductRequest.FindRequest');
    }

    const { uuid } = findRequest;
    const product = await Product.findOne({ where: { uuid } });

    if (!product) {
        throw new ServiceEntityNotFound(`Product with UUID ${uuid} not found`);
    }

    return new ProductResponse(product.dataValues);
}

/**
 * @function findAll
 * @description Finds all products.
 * @param {ProductRequest.FindAllRequest} findAllRequest The find all request.
 * @returns {Promise<ProductResponse[]>} The products.
 * @throws {ServiceArgumentError} If the find all request is not provided.
 */
async function findAll(findAllRequest) {
    if (!(findAllRequest instanceof ProductRequest.FindAllRequest)) {
        throw new ServiceArgumentError('findAllRequest must be an instance of ProductRequest.FindAllRequest');
    }

    let { page, limit } = findAllRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const products = await Product.findAll({ offset, limit })
    const count = await Product.count()
    const pages = Math.ceil(count / limit)
    const productResponses = products.map(product => new ProductResponse(product.dataValues))

    return { products: productResponses, pages }
}

/**
 * @function create
 * @description Creates a product.
 * @param {ProductRequest.CreateRequest} createRequest The create request.
 * @returns {Promise<ProductResponse>} The product.
 * @throws {ServiceArgumentError} If the create request is not provided.
 */
async function create(createRequest) {
    if (!(createRequest instanceof ProductRequest.CreateRequest)) {
        throw new ServiceArgumentError('createRequest must be an instance of ProductRequest.CreateRequest');
    }

    const { name, description } = createRequest;
    const product = await Product.create({ name, description });

    return new ProductResponse(product.dataValues);
}

/**
 * @function update
 * @description Updates a product.
 * @param {ProductRequest.UpdateRequest} updateRequest The update request.
 * @returns {Promise<ProductResponse>} The product.
 * @throws {ServiceArgumentError} If the update request is not provided.
 * @throws {ServiceEntityNotFound} If the product is not found.
 */
async function update(updateRequest) {
    if (!(updateRequest instanceof ProductRequest.UpdateRequest)) {
        throw new ServiceArgumentError('updateRequest must be an instance of ProductRequest.UpdateRequest');
    }

    const { uuid, name, description } = updateRequest;
    const product = await Product.findOne({ where: { uuid } });
    
    if (!product) {
        throw new ServiceEntityNotFound(`Product with UUID ${uuid} not found`);
    }
    
    console.log(name, description);
    if (name) product.name = name;
    if (description) product.description = description;
    await product.save();
    console.log(product);
    return new ProductResponse(product.dataValues);
}

/**
 * @function destroy
 * @description Destroys a product.
 * @param {ProductRequest.DeleteRequest} deleteRequest The destroy request.
 * @throws {ServiceArgumentError} If the destroy request is not provided.
 * @throws {ServiceEntityNotFound} If the product is not found.
 */
async function destroy(deleteRequest) {
    if (!(deleteRequest instanceof ProductRequest.DeleteRequest)) {
        throw new ServiceArgumentError('destroyRequest must be an instance of ProductRequest.DeleteRequest');
    }

    const { uuid } = deleteRequest;
    const product = await Product.findOne({ where: { uuid } });

    if (!product) {
        throw new ServiceEntityNotFound(`Product with UUID ${uuid} not found`);
    }

    await product.destroy();
}

export default {
    create,
    findAll,
    find,
    update,
    destroy,
    ProductRequest
};
