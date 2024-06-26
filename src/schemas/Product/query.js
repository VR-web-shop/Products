
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/Product/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/Product/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const service = ModelQueryService();

const resolvers = {
  Query: {
	products: async (_, { limit, page }, context) => {
		try {
			return await Restricted({ context, permission: 'products:index' }, async () => {
				const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
				return { __typename: 'Products', rows, pages, count };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to get products');
		}
	},
	product: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'products:show' }, async () => {
				const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
				return { __typename: 'Product', ...entity };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to get product');
		}
	}
  }
};

export default resolvers;
