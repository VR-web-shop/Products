import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductEntityState/ReadOneQuery.js";
import CreateCommand from "../../commands/ProductEntityState/CreateCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    createProductEntityState: async (_, { input }, context) => {
      try {
        return await Restricted({ context, permission: 'product-entity-states:put' }, async () => {
          const { name } = input;
          await commandService.invoke(new CreateCommand(name));
          const entity = await queryService.invoke(new ReadOneQuery(name));
          return { __typename: 'ProductEntityState', ...entity };
        })
      } catch (error) {
        console.log('error', error);
        if (error instanceof RequestError) return error.toResponse();
        else throw new Error('Failed to put product entity state');
      }
    }
  }
};

export default resolvers;