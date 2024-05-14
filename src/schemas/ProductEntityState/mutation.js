import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ReadOneQuery from "../../queries/ProductEntityState/ReadOneQuery.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import CreateCommand from "../../commands/ProductEntityState/CreateCommand.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const queryService = ModelQueryService();
const commandService = ModelCommandService();

const resolvers = {
  Mutation: {
    createProductEntityState: async (_, { input }, context) => {
      try {
        throw new RequestError('Deprecated', 'This mutation is deprecated.', 410)
        
        return await Restricted({ context, permission: 'product-entity-states:create' }, async () => {
          const { name } = input;
          await commandService.invoke(new CreateCommand(name));
          const entity = await queryService.invoke(new ReadOneQuery(name));
          return { __typename: 'ProductEntityState', ...entity };
        })
      } catch (error) {
        if (error instanceof RequestError) {
          rollbar.info('RequestError', { code: error.code, message: error.message })
          return error.toResponse();
        }
        
        rollbar.error(error);
        console.log('error', error);
        throw new Error('Failed to create product entity state');
        
      }
    }
  }
};

export default resolvers;