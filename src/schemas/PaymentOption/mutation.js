import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/PaymentOption/ReadOneQuery.js";
import PutCommand from "../../commands/PaymentOption/PutCommand.js";
import DeleteCommand from "../../commands/PaymentOption/DeleteCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putPaymentOption: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'payment-options:put' }, async () => {
                    const { clientSideUUID, name, price } = input;
                    await commandService.invoke(new PutCommand(clientSideUUID, { name, price }));
                    const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'PaymentOption', ...entity };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to put payment options');
            }
        },
        deletePaymentOption: async (_, { clientSideUUID }) => {
            try {
                return await Restricted({ context, permission: 'payment-options:delete' }, async () => {
                    await commandService.invoke(new DeleteCommand(clientSideUUID));
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to delete payment options');
            }
        }
    }
};

export default resolvers;
