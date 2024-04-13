import ProductService from "../../services/ProductService.js";

const typeDef = `
  type Product {
    uuid: String!
    name: String!
    description: String!
    thumbnail_source: String!
    price: Float!
  }

  type Query {
    products: [Product]
    product(uuid: String!): Product
  }
`;

const resolvers = {
  Query: {
    products: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get products');
        }
    },
    product: async (_, { uuid }) => {
      try {
        return await ProductService.find(uuid);
      } catch (error) {
        throw new Error('Failed to get product');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
