
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/DeliverOption/ReadOneQuery.js";
import PutDeliverOptionSaga from "../../sagas/DeliverOption/PutDeliverOptionSagaOut.js";
import DeleteDeliverOptionSaga from "../../sagas/DeliverOption/DeleteDeliverOptionSagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putDeliverOption: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:put' }, async () => {
                    const { clientSideUUID, name, price } = input;
                    await PutDeliverOptionSaga({ client_side_uuid: clientSideUUID, name, price });
                    const entity = await queryService.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'DeliverOption', ...entity };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to put deliver option');
            }
        },
        deleteDeliverOption: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:delete' }, async () => {
                    await DeleteDeliverOptionSaga({ client_side_uuid: clientSideUUID });
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to delete deliver option');
            }
        }
    }
};

export default resolvers;
