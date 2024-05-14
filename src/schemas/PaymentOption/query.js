
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/PaymentOption/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/PaymentOption/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const service = ModelQueryService();

const resolvers = {
    Query: {
        paymentOptions: async (_, { limit, page }, context) => {
            try {
                return await Restricted({ context, permission: 'payment-options:index' }, async () => {
                    const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                    return { __typename: 'PaymentOptions', rows, pages, count };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to get payment options');
            }
        },
        paymentOption: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'payment-options:show' }, async () => {
                    const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'PaymentOption', ...entity };
                })
            } catch (error) {
                if (error instanceof RequestError) {
                    rollbar.info('RequestError', { code: error.code, message: error.message })
                    return error.toResponse();
                }
                
                rollbar.error(error);
                console.log('error', error);
                throw new Error('Failed to get payment option');
            }
        }
    }
};

export default resolvers;
