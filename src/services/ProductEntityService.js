import ServiceArgumentError from "./errors/ServiceArgumentError.js";
import ServiceEntityNotFound from "./errors/ServiceEntityNotFound.js";
import ProductEntityRequest from "../dtos/ProductEntityRequest.js";
import ProductEntityResponse from "../dtos/ProductEntityResponse.js";
import ProductEntity from "../models/ProductEntity.js";

/**
 * @function find
 * @description Finds a product entity by UUID.
 * @param {ProductEntityRequest.FindRequest} findRequest The find request.
 * @returns {Promise<ProductEntityResponse>} The product entity.
 * @throws {ServiceArgumentError} If the find request is not provided.
 * @throws {ServiceEntityNotFound} If the product entity is not found.
 */
async function find(findRequest) {
    if (!(findRequest instanceof ProductEntityRequest.FindRequest)) {
        throw new ServiceArgumentError('findRequest must be an instance of ProductEntityRequest.FindRequest');
    }

    const { uuid } = findRequest;
    const productEntity = await ProductEntity.findOne({ where: { uuid } });

    if (!productEntity) {
        throw new ServiceEntityNotFound(`ProductEntity with UUID ${uuid} not found`);
    }

    return new ProductEntityResponse(productEntity);
}

/**
 * @function findAll
 * @description Finds all product entities.
 * @param {ProductEntityRequest.FindAllRequest} findAllRequest The find all request.
 * @returns {Promise<ProductEntityResponse[]>} The product entities.
 * @throws {ServiceArgumentError} If the find all request is not provided.
 */
async function findAll(findAllRequest) {
    if (!(findAllRequest instanceof ProductEntityRequest.FindAllRequest)) {
        throw new ServiceArgumentError('findAllRequest must be an instance of ProductEntityRequest.FindAllRequest');
    }

    let { page, limit } = findAllRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const productEntities = await ProductEntity.findAll({ offset, limit })
    const count = await ProductEntity.count()
    const pages = Math.ceil(count / limit)
    const productEntityResponses = productEntities.map(entity => new ProductEntityResponse(entity.dataValues))

    return { productEntities: productEntityResponses, pages }
}

/**
 * @function create
 * @description Creates a product entity.
 * @param {ProductEntityRequest.CreateRequest} createRequest The create request.
 * @returns {Promise<ProductEntityResponse>} The product entity.
 * @throws {ServiceArgumentError} If the create request is not provided.
 */
async function create(createRequest) {
    if (!(createRequest instanceof ProductEntityRequest.CreateRequest)) {
        throw new ServiceArgumentError('createRequest must be an instance of ProductEntityRequest.CreateRequest');
    }

    const { product_uuid } = createRequest;
    const productEntity = await ProductEntity.create({ product_uuid });

    return new ProductEntityResponse(productEntity);
}

/**
 * @function update
 * @description Updates a product entity.
 * @param {ProductEntityRequest.UpdateRequest} updateRequest The update request.
 * @returns {Promise<ProductEntityResponse>} The product entity.
 * @throws {ServiceArgumentError} If the update request is not provided.
 * @throws {ServiceEntityNotFound} If the product entity is not found.
 */
async function update(updateRequest) {
    if (!(updateRequest instanceof ProductEntityRequest.UpdateRequest)) {
        throw new ServiceArgumentError('updateRequest must be an instance of ProductEntityRequest.UpdateRequest');
    }

    const { uuid, productUuid } = updateRequest;
    const productEntity = await ProductEntity.findOne({ where: { uuid } });

    if (!productEntity) {
        throw new ServiceEntityNotFound(`ProductEntity with UUID ${uuid} not found`);
    }

    productEntity.productUuid = productUuid;
    await productEntity.save();

    return new ProductEntityResponse(productEntity);
}

/**
 * @function destroy
 * @description Destroys a product entity.
 * @param {ProductEntityRequest.DestroyRequest} destroyRequest The destroy request.
 * @throws {ServiceArgumentError} If the destroy request is not provided.
 * @throws {ServiceEntityNotFound} If the product entity is not found.
 */
async function destroy(destroyRequest) {
    if (!(destroyRequest instanceof ProductEntityRequest.DestroyRequest)) {
        throw new ServiceArgumentError('destroyRequest must be an instance of ProductEntityRequest.DestroyRequest');
    }

    const { uuid } = destroyRequest;
    const productEntity = await ProductEntity.findOne({ where: { uuid } });

    if (!productEntity) {
        throw new ServiceEntityNotFound(`ProductEntity with UUID ${uuid} not found`);
    }

    await productEntity.destroy();
}

export default {
    create,
    findAll,
    find,
    update,
    destroy,
    ProductEntityRequest
}
