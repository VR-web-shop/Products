import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductOrder/ReadOneQuery.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import DeleteCommand from "../../commands/ProductOrder/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
	Mutation: {
		putProductOrder: async (_, { input }, context) => {
			try {
				return await Restricted({ context, permission: 'product-orders:put' }, async () => {
					const { clientSideUUID } = input;
					delete input.clientSideUUID;
					await commandService.invoke(new PutCommand(clientSideUUID, { ...input }));
					const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
					return { __typename: 'ProductOrder', ...entity };
				})
			} catch (error) {
				console.log('error', error);
				if (error instanceof RequestError) return error.toResponse();
				else throw new Error('Failed to put product order');
			}
		},
		deleteProductOrder: async (_, { clientSideUUID }) => {
			try {
				return await Restricted({ context, permission: 'product-orders:delete' }, async () => {
					await commandService.invoke(new DeleteCommand(clientSideUUID));
					return { __typename: 'BooleanResult', result: true };
				})
			} catch (error) {
				console.log('error', error);
				if (error instanceof RequestError) return error.toResponse();
				else throw new Error('Failed to delete product order');
			}
		}
	}
};

export default resolvers;
