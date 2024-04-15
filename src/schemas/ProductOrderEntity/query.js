import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrderEntity/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ProductOrderEntity/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";

const service = ModelQueryService();

const resolvers = {
  Query: {
    productOrderEntities: async (_, { limit, page }, context) => {
        try {
            return await Restricted({ context, permission: 'product-order-entities:index' }, async () => {
                const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                return { __typename: 'ProductOrderEntities', rows, pages, count };
            })
        } catch (error) {
            console.log('error', error);
            if (error instanceof RequestError) return error.toResponse();
            else throw new Error('Failed to get product order entities');
        }
    },
    productOrderEntity: async (_, { clientSideUUID }, context) => {
        try {
            return await Restricted({ context, permission: 'product-order-entities:show' }, async () => {
                const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
                return { __typename: 'ProductOrderEntity', ...entity };
            })
        } catch (error) {
            console.log('error', error);
            if (error instanceof RequestError) return error.toResponse();
            else throw new Error('Failed to get product order entity');
        }
    }
  }
};

export default resolvers;
