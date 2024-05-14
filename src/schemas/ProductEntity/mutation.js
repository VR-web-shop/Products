import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductEntity/ReadOneQuery.js";
import PutProductEntitySaga from "../../sagas/ProductEntity/PutProductEntitySagaOut.js";
import DeleteProductEntitySaga from "../../sagas/ProductEntity/DeleteProductEntitySagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
	putProductEntity: async (_, { input }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:put' }, async () => {
				const { clientSideUUID: client_side_uuid, product_entity_state_name, product_client_side_uuid } = input;
				await PutProductEntitySaga({ client_side_uuid, product_entity_state_name, product_client_side_uuid });
				const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid));
				return { __typename: 'ProductEntity', ...entity };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to put product entity');
		}
	},
	deleteProductEntity: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:delete' }, async () => {
				await DeleteProductEntitySaga({ client_side_uuid: clientSideUUID });
				return { __typename: 'BooleanResult', result: true };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}
			
			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to delete product entity');
		}
	}
  }
};

export default resolvers;
