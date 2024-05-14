import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductOrderState/ReadOneQuery.js";
import CreateCommand from "../../commands/ProductOrderState/CreateCommand.js";
import Restricted from "../../jwt/Restricted.js";
import rollbar from "../../../rollbar.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    createProductOrderState: async (_, { input }, context) => {
      try {
        throw new RequestError('Deprecated', 'This mutation is deprecated.', 410)

        return await Restricted({ context, permission: 'product-order-states:create' }, async () => {
          const { name } = input;
          await commandService.invoke(new CreateCommand(name));
          const entity = await queryService.invoke(new ReadOneQuery(name));
          return { __typename: 'ProductOrderState', ...entity };
        })
      } catch (error) {
        if (error instanceof RequestError) {
          rollbar.info('RequestError', { code: error.code, message: error.message })
          return error.toResponse();
        }
  
        rollbar.error(error);
        console.log('error', error);
        throw new Error('Failed to create product order state');
      }
    },
  }
};

export default resolvers;
