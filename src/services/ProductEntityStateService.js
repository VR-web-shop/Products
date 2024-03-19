import ProductEntityState from "../models/ProductEntityState.js";
import ProductEntityStateRequest from "../dtos/ProductEntityStateRequest.js";
import ProductEntityStateResponse from "../dtos/ProductEntityStateResponse.js";

/**
 * @function find
 * @description Finds a product entity state by name.
 * @param {ProductEntityStateRequest.FindRequest} findRequest The find request.
 * @returns {Promise<ProductEntityStateResponse>} The product entity state.
 * @throws {ServiceArgumentError} If the find request is not provided.
 * @throws {ServiceEntityNotFound} If the product entity is not found.
 */
async function find(findRequest) {
    if (!(findRequest instanceof ProductEntityRequest.FindRequest)) {
        throw new ServiceArgumentError('findRequest must be an instance of ProductEntityRequest.FindRequest');
    }

    const { name } = findRequest;
    const productEntityState = await ProductEntityState.findOne({ where: { name } });

    if (!productEntityState) {
        throw new ServiceEntityNotFound(`ProductEntityState with name ${name} not found`);
    }

    return new ProductEntityStateResponse(productEntityState.dataValues);
}

/**
 * @function findAll
 * @description Finds all product entity states.
 * @param {ProductEntityStateRequest.FindAllRequest} findAllRequest The find all request.
 * @returns {Promise<ProductEntityStateResponse[]>} The product entity state.
 * @throws {ServiceArgumentError} If the find all request is not provided.
 */
async function findAll(findAllRequest) {
    if (!(findAllRequest instanceof ProductEntityStateRequest.FindAllRequest)) {
        throw new ServiceArgumentError('findAllRequest must be an instance of ProductEntityStateRequest.FindAllRequest');
    }

    let { page, limit } = findAllRequest
    if (!page) page = 1
    
    const offset = (page - 1) * limit
    const productEntityStates = await ProductEntityState.findAll({ offset, limit })
    const count = await ProductEntityState.count()
    const pages = Math.ceil(count / limit)
    const productEntityStateResponses = productEntityStates.map(state => new ProductEntityStateResponse(state.dataValues))

    return { productEntityStates: productEntityStateResponses, pages }
}

export default {
    find,
    findAll,
    ProductEntityStateRequest
};
