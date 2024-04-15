import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ValutaSetting/ReadOneQuery.js";
import ReadCollectionQuery from "../../queries/ValutaSetting/ReadCollectionQuery.js";
import Restricted from "../../jwt/Restricted.js";

const service = ModelQueryService();

const resolvers = {
  Query: {
    valutaSettings: async (_, { limit, page }, context) => {
        try {
            return await Restricted({ context, permission: 'valuta-settings:index' }, async () => {
                const { rows, pages, count } = await service.invoke(new ReadCollectionQuery({ limit, page }));
                return { __typename: 'ValutaSettings', rows, pages, count };
            })
        } catch (error) {
            console.log('error', error);
            if (error instanceof RequestError) return error.toResponse();
            else throw new Error('Failed to get valuta settings');
        }
    },
    valutaSetting: async (_, { clientSideUUID }, context) => {
        try {
            return await Restricted({ context, permission: 'valuta-settings:show' }, async () => {
                const entity = await service.invoke(new ReadOneQuery(clientSideUUID));
                return { __typename: 'ValutaSetting', ...entity };
            })
        } catch (error) {
            console.log('error', error);
            if (error instanceof RequestError) return error.toResponse();
            else throw new Error('Failed to get valuta setting');
        }
    }
  }
};

export default resolvers;