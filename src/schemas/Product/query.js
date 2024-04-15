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
    products(limit: Float, offset: Float): [Product]
    product(uuid: String!): Product
  }
`;

const resolvers = {
  Query: {
    products: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductService.findAll(limit, offset);
        } catch (error) {
            console.log('error', error);
            throw new Error('Failed to get products');
        }
    },
    product: async (_, { uuid }) => {
      try {
        return await ProductService.find(uuid);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to get product');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
