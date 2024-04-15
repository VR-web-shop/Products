import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductOrderEntity/ReadOneQuery.js";
import PutCommand from "../../commands/ProductOrderEntity/PutCommand.js";
import DeleteCommand from "../../commands/ProductOrderEntity/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    putProductOrderEntity: async (_, { input }, context) => {
		try {
			return await Restricted({ context, permission: 'product-order-entities:put' }, async () => {
				const { clientSideUUID, product_order_uuid, product_entity_uuid } = input;
				await commandService.invoke(new PutCommand(clientSideUUID, { product_order_uuid, product_entity_uuid }));
				const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
				return { __typename: 'ProductOrderEntity', ...entity };
			})
		} catch (error) {
			console.log('error', error);
			if (error instanceof RequestError) return error.toResponse();
			else throw new Error('Failed to put product order entity');
		}
	},
	deleteProductOrderEntity: async (_, { clientSideUUID }) => {
		try {
			return await Restricted({ context, permission: 'product-order-entities:delete' }, async () => {
				await commandService.invoke(new DeleteCommand(clientSideUUID));
				return { __typename: 'BooleanResult', result: true };
			})
		} catch (error) {
			console.log('error', error);
			if (error instanceof RequestError) return error.toResponse();
			else throw new Error('Failed to delete product order entity');
		}
	}
  }
};

export default resolvers;
