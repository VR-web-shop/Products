import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/Product/ReadOneQuery.js";
import PutProductSaga from "../../sagas/Product/PutProductSagaOut.js";
import DeleteProductSaga from "../../sagas/Product/DeleteProductSagaOut.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putProduct: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'products:put' }, async () => {
                    rollbar.info('putProduct', { input });
                    const { clientSideUUID: client_side_uuid, name, description, thumbnail_source, price } = input;
                    await PutProductSaga({ client_side_uuid, name, description, thumbnail_source, price });
                    const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid));
                    return { __typename: 'Product', ...entity };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to put product');
            }
        },
        deleteProduct: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'products:delete' }, async () => {
                    rollbar.info('deleteProduct', { clientSideUUID });
                    await DeleteProductSaga({ client_side_uuid: clientSideUUID });
                    return { __typename: 'BooleanResult', result: true };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to delete product');
            }
        }
    }
};

export default resolvers;