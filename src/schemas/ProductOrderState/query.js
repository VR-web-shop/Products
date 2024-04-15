import ProductOrderStateService from "../../services/ProductOrderStateService.js";

const typeDef = `
  type ProductOrderState {
    name: String!
  }

  type Query {
    productOrderStates(limit: Float, offset: Float): [ProductOrderState]
    productOrderState(name: String!): ProductOrderState
  }
`;

const resolvers = {
  Query: {
    productOrderStates: async (_, {limit=10, offset=0}) => {
        try {
          return await ProductOrderStateService.findAll(limit, offset);
        } catch (error) {
          console.log('error', error);
          throw new Error('Failed to get product order states');
        }
    },
    productOrderState: async (_, { name }) => {
      try {
        return await ProductOrderStateService.find(name);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to get product order state');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
