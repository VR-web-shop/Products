import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrder/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ProductOrder/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const service = ModelQueryService();

const resolvers = {
    Query: {
        productOrders: async (_, { limit, page }, context) => {
            try {
                return await Restricted({ context, permission: 'product-orders:index' }, async () => {
                    const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                    return { __typename: 'ProductOrders', rows, pages, count };
                })
            } catch (error) {
                if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}

				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to get product orders');
            }
        },
        productOrder: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'product-orders:show' }, async () => {
                    const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'ProductOrder', ...entity };
                })
            } catch (error) {
                if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}

				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to get product order');
            }
        }
    }
};

export default resolvers;
