import PaymentOptionService from "../../services/PaymentOptionService";

const typeDef = `
  type PaymentOption {
    name: String!
    price: Float!
  }

  type Query {
    paymentOptions: [PaymentOption]
    paymentOption(name: String!): PaymentOption
  }
`;

const resolvers = {
  Query: {
    paymentOptions: async (_, {limit=10, offset=0}) => {
        try {
            return await PaymentOptionService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get payment options');
        }
    },
    paymentOption: async (_, { name }) => {
      try {
        return await PaymentOptionService.find(name);
      } catch (error) {
        throw new Error('Failed to get payment option');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
