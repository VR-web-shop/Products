import ProductOrderService from "../../services/ProductOrderService.js";

const typeDef = `
  type Mutation {
    createProductOrder(input: ProductOrderInput!): ProductOrder
    updateProductOrder(input: ProductOrderInput!): ProductOrder
    deleteProductOrder(uuid: String!): Boolean
  }

  input ProductOrderInput {
    uuid: String
    name: String!
    email: String!
    address: String!
    city: String!
    country: String!
    postal_code: String!
    deliver_option_name: String!
    payment_option_name: String!
    product_order_state_name: String!
  }
`;

const resolvers = {
  Mutation: {
    createProductOrder: async (_, { input }) => {
      try {
        const { 
          name, 
            email, 
            address, 
            city, 
            country, 
            postal_code, 
            deliver_option_name,
            payment_option_name,
            product_order_state_name 
        } = input;
        return await ProductOrderService.create(
            name, 
            email, 
            address, 
            city, 
            country, 
            postal_code, 
            deliver_option_name,
            payment_option_name,
            product_order_state_name
        );
      } catch (error) {
        throw new Error('Failed to create product order');
      }
    },
    updateProductOrder: async (_, { input  }) => {
      try {
        const { 
          uuid, 
          name, 
          email, 
          address, 
          city, 
          country, 
          postal_code, 
          deliver_option_name, 
          payment_option_name, 
          product_order_state_name 
        } = input;
        return await ProductOrderService.update(
          uuid, 
          name, 
          email, 
          address, 
          city, 
          country, 
          postal_code, 
          deliver_option_name, 
          payment_option_name, 
          product_order_state_name
        );
      } catch (error) {
        throw new Error('Failed to update product order');
      }
    },
    deleteProductOrder: async (_, { uuid }) => {
      try {
        await ProductOrderService.remove(uuid);
        return true;
      } catch (error) {
        throw new Error('Failed to delete product order');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
