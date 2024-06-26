import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ValutaSetting/ReadOneQuery.js";
import PutCommand from "../../commands/ValutaSetting/PutCommand.js";
import DeleteCommand from "../../commands/ValutaSetting/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    putValutaSetting: async (_, { input }, context) => {
		try {
			return await Restricted({ context, permission: 'valuta-settings:put' }, async () => {
				const { clientSideUUID, name, short, symbol, active } = input;
				await commandService.invoke(new PutCommand(clientSideUUID, { name, short, symbol, active }));
				const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
				return { __typename: 'ValutaSetting', ...entity };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}

			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to put valuta setting');
		}
	},
	deleteValutaSetting: async (_, { clientSideUUID }, context) => {
		try {
			return await Restricted({ context, permission: 'valuta-settings:delete' }, async () => {
				await commandService.invoke(new DeleteCommand(clientSideUUID));
				return { __typename: 'BooleanResult', result: true };
			})
		} catch (error) {
			if (error instanceof RequestError) {
				rollbar.info('RequestError', { code: error.code, message: error.message })
				return error.toResponse();
			}

			rollbar.error(error);
			console.log('error', error);
			throw new Error('Failed to delete valuta setting');
		}
	}
  }
};

export default resolvers;
