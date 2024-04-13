import ProductOrderStateService from "../../services/ProductOrderStateService";

const typeDef = `
  type Mutation {
    createProductOrderState(input: ProductOrderStateInput!): ProductOrderState
    deleteProductOrderState(name: String!): Boolean
  }

  input ProductOrderStateInput {
    name: String!
  }
`;

const resolvers = {
  Mutation: {
    createProductOrderState: async (_, { input }) => {
      try {
        const { name } = input;
        return await ProductOrderStateService.create(name);
      } catch (error) {
        throw new Error('Failed to create product order state');
      }
    },
    deleteProductOrderState: async (_, { name }) => {
      try {
        await ProductOrderStateService.remove(name);
        return true;
      } catch (error) {
        throw new Error('Failed to delete product order state');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
