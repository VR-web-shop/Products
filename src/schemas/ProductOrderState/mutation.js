import RequestError from "../RequestError/RequestError.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import ModelCommandService from "../../services/ModelCommandService.js";
import ReadOneQuery from "../../queries/ProductOrderState/ReadOneQuery.js";
import CreateCommand from "../../commands/ProductOrderState/CreateCommand.js";
import Restricted from "../../jwt/Restricted.js";

const commandService = ModelCommandService();
const queryService = ModelQueryService();

const resolvers = {
  Mutation: {
    createProductOrderState: async (_, { input }) => {
      try {
        return await Restricted({ context, permission: 'product-order-states:put' }, async () => {
          const { name } = input;
          await commandService.invoke(new CreateCommand(name));
          const entity = await queryService.invoke(new ReadOneQuery(name));
          return { __typename: 'ProductOrderState', ...entity };
        })
      } catch (error) {
        console.log('error', error);
        if (error instanceof RequestError) return error.toResponse();
        else throw new Error('Failed to put product entity state');
      }
    },
  }
};

export default resolvers;
