import ProductOrderService from "../../services/ProductOrderService.js";

const typeDef = `
  type ProductOrder {
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

  type Query {
    productOrders: [ProductOrder]
    productOrder(uuid: String!): ProductOrder
  }
`;

const resolvers = {
  Query: {
    productOrders: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductOrderService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get product orders');
        }
    },
    productOrder: async (_, { uuid }) => {
      try {
        return await ProductOrderService.find(uuid);
      } catch (error) {
        throw new Error('Failed to get product order');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
