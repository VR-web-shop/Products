import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductOrder/ReadOneQuery.js";
import PutProductOrderSaga from "../../sagas/ProductOrder/PutProductOrderSagaOut.js";
import DeleteProductOrderSaga from "../../sagas/ProductOrder/DeleteProductOrderSagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
	Mutation: {
		putProductOrder: async (_, { input }, context) => {
			try {
				return await Restricted({ context, permission: 'product-orders:put' }, async () => {
					await PutProductOrderSaga({ client_side_uuid: input.clientSideUUID, ...input });
					const entity = await queryService.invoke(new ReadOneQuery(input.clientSideUUID));
					return { __typename: 'ProductOrder', ...entity };
				})
			} catch (error) {
				if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}

				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to put product order');
			}
		},
		deleteProductOrder: async (_, { clientSideUUID }, context) => {
			try {
				return await Restricted({ context, permission: 'product-orders:delete' }, async () => {
					await DeleteProductOrderSaga({ client_side_uuid: clientSideUUID });
					return { __typename: 'BooleanResult', result: true };
				})
			} catch (error) {
				if (error instanceof RequestError) {
					rollbar.info('RequestError', { code: error.code, message: error.message })
					return error.toResponse();
				}

				rollbar.error(error);
				console.log('error', error);
				throw new Error('Failed to delete product order');
			}
		}
	}
};

export default resolvers;
