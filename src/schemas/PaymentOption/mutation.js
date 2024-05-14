import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/PaymentOption/ReadOneQuery.js";
import PutPaymentOptionSaga from "../../sagas/PaymentOption/PutPaymentOptionSagaOut.js";
import DeletePaymentOptionSaga from "../../sagas/PaymentOption/DeletePaymentOptionSagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putPaymentOption: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'payment-options:put' }, async () => {
                    const { clientSideUUID, name, price } = input;
                    await PutPaymentOptionSaga({ client_side_uuid: clientSideUUID, name, price });
                    const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'PaymentOption', ...entity };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to put payment option');
            }
        },
        deletePaymentOption: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'payment-options:delete' }, async () => {
                    await DeletePaymentOptionSaga({ client_side_uuid: clientSideUUID });
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to delete payment option');
            }
        }
    }
};

export default resolvers;
