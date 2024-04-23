import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductEntity/ReadOneQuery.js";
import PutProductEntitySaga from "../../sagas/ProductEntity/PutProductEntitySaga.js";
import DeleteCommand from "../../commands/ProductEntity/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
	putProductEntity: async (_, { input }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:put' }, async () => {
				const { clientSideUUID: client_side_uuid, product_entity_state_name, product_client_side_uuid } = input;
				await PutProductEntitySaga.execute({ client_side_uuid, product_entity_state_name, product_client_side_uuid });
				const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid));
				return { __typename: 'ProductEntity', ...entity };
			})
		} catch (error) {
			console.log('error', error);
			if (error instanceof RequestError) return error.toResponse();
			else throw new Error('Failed to put product entity');
		}
	},
	deleteProductEntity: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'product-entities:delete' }, async () => {
				await commandService.invoke(new DeleteCommand(clientSideUUID));
				return { __typename: 'BooleanResult', result: true };
			})
		} catch (error) {
			console.log('error', error);
			if (error instanceof RequestError) return error.toResponse();
			else throw new Error('Failed to delete product entity');
		}
	}
  }
};

export default resolvers;
