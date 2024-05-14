import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductOrderEntity/ReadOneQuery.js";
import PutProductOrderEntitySaga from "../../sagas/ProductOrderEntity/PutProductOrderEntitySagaOut.js";
import DeleteProductOrderEntitySaga from "../../sagas/ProductOrderEntity/DeleteProductOrderEntitySagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    putProductOrderEntity: async (_, { input }, context) => {
		try {
			return await Restricted({ context, permission: 'product-order-entities:put' }, async () => {
				const { clientSideUUID: client_side_uuid, product_order_client_side_uuid, product_entity_client_side_uuid } = input;
				await PutProductOrderEntitySaga({ client_side_uuid, product_order_client_side_uuid, product_entity_client_side_uuid });
				const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid));
				return { __typename: 'ProductOrderEntity', ...entity };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}

			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to put product order entity');
		}
	},
	deleteProductOrderEntity: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'product-order-entities:delete' }, async () => {
				await DeleteProductOrderEntitySaga({ client_side_uuid: clientSideUUID });
				return { __typename: 'BooleanResult', result: true };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}

			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to delete product order entity');
		}
	}
  }
};

export default resolvers;
