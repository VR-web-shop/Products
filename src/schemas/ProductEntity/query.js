import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductEntity/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ProductEntity/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const service = ModelQueryService();

const resolvers = {
  Query: {
	productEntities: async (_, { limit, page }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:index' }, async () => {
				const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
				return { __typename: 'ProductEntities', rows, pages, count };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to get product entities');
		}
	},
	productEntity: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:show' }, async () => {
				const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
				return { __typename: 'ProductEntity', ...entity };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to get product entities');
		}
	}
  }
};

export default resolvers;