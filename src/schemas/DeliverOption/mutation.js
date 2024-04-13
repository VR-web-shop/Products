import DeliverOptionService from "../../services/DeliverOptionService.js";

const typeDef = `
  type Mutation {
    createDeliverOption(input: DeliverOptionInput!): DeliverOption
    updateDeliverOption(input: DeliverOptionInput!): DeliverOption
    deleteDeliverOption(name: String!): Boolean
  }

  input DeliverOptionInput {
    name: String!
    price: Float!
  }
`;

const resolvers = {
  Mutation: {
    createDeliverOption: async (_, { input }) => {
      try {
        const { name, price } = input;
        return await DeliverOptionService.create(name, price);
      } catch (error) {
        throw new Error('Failed to create deliver option');
      }
    },
    updateDeliverOption: async (_, { input  }) => {
      try {
        const { name, price } = input;
        return await DeliverOptionService.update(name, price);
      } catch (error) {
        throw new Error('Failed to update deliver option');
      }
    },
    deleteDeliverOption: async (_, { name }) => {
      try {
        await DeliverOptionService.remove(name);
        return true;
      } catch (error) {
        throw new Error('Failed to delete deliver option');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
