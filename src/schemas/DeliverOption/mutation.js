import DeliverOptionService from "../../services/DeliverOptionService.js";

const typeDef = `
  type Mutation {
    updateDeliverOption(input: DeliverOptionInput!): DeliverOption
  }

  input DeliverOptionInput {
    name: String!
    price: Float!
  }
`;

const resolvers = {
  Mutation: {
    updateDeliverOption: async (_, { input  }) => {
      try {
        const { name, price } = input;
        return await DeliverOptionService.update(name, price);
      } catch (error) {
        throw new Error('Failed to update deliver option');
      }
    },
  }
};

export default {
    typeDef,
    resolvers
};
