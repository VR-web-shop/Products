
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/DeliverOption/ReadOneQuery.js";
import PutCommand from "../../commands/DeliverOption/PutCommand.js";
import DeleteCommand from "../../commands/DeliverOption/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putDeliverOption: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:put' }, async () => {
                    const { clientSideUUID, name, price } = input;
                    await commandService.invoke(new PutCommand(clientSideUUID, { name, price }));
                    const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'DeliverOption', ...entity };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to put deliver options');
            }
        },
        deleteDeliverOption: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:delete' }, async () => {
                    await commandService.invoke(new DeleteCommand(clientSideUUID));
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to delete deliver options');
            }
        }
    }
};

export default resolvers;
