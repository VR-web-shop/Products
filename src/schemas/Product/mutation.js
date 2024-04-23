import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/Product/ReadOneQuery.js";
import PutProductSaga from "../../sagas/Product/PutProductSaga.js";
import DeleteProductSaga from "../../sagas/Product/DeleteProductSaga.js";
import Restricted from "../../jwt/Restricted.js";

const queryService = ModelQueryService();

const resolvers = {
    Mutation: {
        putProduct: async (_, { input }, context) => {
            try {
                return await Restricted({ context, permission: 'products:put' }, async () => {
                    const { clientSideUUID: client_side_uuid, name, description, thumbnail_source, price } = input;
                    await PutProductSaga.execute({ client_side_uuid, name, description, thumbnail_source, price });
                    const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid));
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
                    await DeleteProductSaga.execute({ client_side_uuid: clientSideUUID });
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