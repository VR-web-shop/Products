
import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/DeliverOption/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/DeliverOption/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";

const service = ModelQueryService();

const resolvers = {
    Query: {
        deliverOptions: async (_, { limit, page }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:index' }, async () => {
                    const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                    return { __typename: 'DeliverOptions', rows, pages, count };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to get deliver options');
            }
        },
        deliverOption: async (_, { clientSideUUID }, context) => {
            try {
                return await Restricted({ context, permission: 'deliver-options:show' }, async () => {
                    const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
                    return { __typename: 'DeliverOption', ...entity };
                })
            } catch (error) {
                console.log('error', error);
                if (error instanceof RequestError) return error.toResponse();
                else throw new Error('Failed to get deliver option');
            }
        }
    }
};

export default resolvers;
