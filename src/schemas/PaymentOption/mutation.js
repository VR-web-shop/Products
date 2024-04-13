import PaymentOptionService from "../../services/PaymentOptionService.js";

const typeDef = `
  type Mutation {
    createPaymentOption(input: PaymentOptionInput!): PaymentOption
    updatePaymentOption(input: PaymentOptionInput!): PaymentOption
    deletePaymentOption(name: String!): Boolean
  }

  input PaymentOptionInput {
    name: String!
    price: Float!
  }
`;

const resolvers = {
  Mutation: {
    createPaymentOption: async (_, { input }) => {
      try {
        const { name, price } = input;
        return await PaymentOptionService.create(name, price);
      } catch (error) {
        throw new Error('Failed to create payment option');
      }
    },
    updatePaymentOption: async (_, { input  }) => {
      try {
        const { name, price } = input;
        return await PaymentOptionService.update(name, price);
      } catch (error) {
        throw new Error('Failed to update payment option');
      }
    },
    deletePaymentOption: async (_, { name }) => {
      try {
        await PaymentOptionService.remove(name);
        return true;
      } catch (error) {
        throw new Error('Failed to delete payment option');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
