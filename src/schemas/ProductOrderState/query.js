import ProductOrderStateService from "../../services/ProductOrderStateService.js";

const typeDef = `
  type ProductOrderState {
    name: String!
  }

  type Query {
    productOrderStates: [ProductOrderState]
    productOrderState(name: String!): ProductOrderState
  }
`;

const resolvers = {
  Query: {
    productOrderStates: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductOrderStateService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get product order states');
        }
    },
    productOrderState: async (_, { name }) => {
      try {
        return await ProductOrderStateService.find(name);
      } catch (error) {
        throw new Error('Failed to get product order state');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
