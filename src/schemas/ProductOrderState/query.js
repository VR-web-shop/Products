import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrderState/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ProductOrderState/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const service = ModelQueryService();

const resolvers = {
	Query: {
		productOrderStates: async (_, { limit, page }, context) => {
			try {
				return await Restricted({ context, permission: 'product-order-states:index' }, async () => {
					const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
					return { __typename: 'ProductOrderStates', rows, pages, count };
				})
			} catch (error) {
				if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}
	
				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to get product order states');
			}
		},
		productOrderState: async (_, { name }, context) => {
			try {
				return await Restricted({ context, permission: 'product-order-states:show' }, async () => {
					const entity = await service.invoke(new ReadOneQuery(name));
					return { __typename: 'ProductOrderState', ...entity };
				})
			} catch (error) {
				if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}
	
				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to get product order state');
			}
		}
	}
};

export default resolvers;
