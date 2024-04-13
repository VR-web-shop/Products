import ProductEntityStateService from "../../services/ProductEntityStateService";

const typeDef = `
  type ProductEntityState {
    name: String!
  }

  type Query {
    productEntityStates: [ProductEntityState]
    productEntityState(name: String!): ProductEntityState
  }
`;

const resolvers = {
  Query: {
    productEntityStates: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductEntityStateService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get product entity states');
        }
    },
    productEntityState: async (_, { name }) => {
      try {
        return await ProductEntityStateService.find(name);
      } catch (error) {
        throw new Error('Failed to get product entity state');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
