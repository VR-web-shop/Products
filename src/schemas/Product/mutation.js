import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/Product/ReadOneQuery.js";
import PutCommand from "../../commands/Product/PutCommand.js";
import DeleteCommand from "../../commands/Product/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putProduct: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'products:put' }, async () => {
                    const { clientSideUUID, name, description, thumbnail_source, price } = input;
                    await commandService.invoke(new PutCommand(clientSideUUID, { name, description, thumbnail_source, price }));
                    const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'Product', ...entity };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to put product');
            }
        },
        deleteProduct: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'products:delete' }, async () => {
                    await commandService.invoke(new DeleteCommand(clientSideUUID));
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to delete product');
            }
        }
    }
};

export default resolvers;