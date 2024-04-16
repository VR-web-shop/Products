import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductEntityState/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ProductEntityState/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";

const service = ModelQueryService();

const resolvers = {
    Query: {
        productEntityStates: async (_, { limit, page }, context) => {
            try {
                return await Restricted({ context, permission: 'product-entity-states:index' }, async () => {
                    const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                    return { __typename: 'ProductEntityStates', rows, pages, count };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to get product entity states');
            }
        },
        productEntityState: async (_, { name }, context) => {
            try {
                return await Restricted({ context, permission: 'product-entity-states:show' }, async () => {
                    const entity = await service.invoke(new ReadOneQuery(name));
                    return { __typename: 'ProductEntityState', ...entity };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to get product entity state');
            }
        }
    }
};

export default resolvers;
