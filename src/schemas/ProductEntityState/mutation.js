import ProductEntityStateService from "../../services/ProductEntityStateService";

const typeDef = `
  type Mutation {
    createProductEntityState(input: ProductEntityStateInput!): ProductEntityState
    deleteProductEntityState(name: String!): Boolean
  }

  input ProductEntityStateInput {
    name: String!
  }
`;

const resolvers = {
  Mutation: {
    createProductEntityState: async (_, { input }) => {
      try {
        const { name } = input;
        return await ProductEntityStateService.create(name);
      } catch (error) {
        throw new Error('Failed to create product entitiy state');
      }
    },
    deleteProductEntityState: async (_, { name }) => {
      try {
        await ProductEntityStateService.remove(name);
        return true;
      } catch (error) {
        throw new Error('Failed to delete product entitiy state');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
