import ProductService from "../../services/ProductService.js";

const typeDef = `
  type Mutation {
    createProduct(input: ProductInput!): Product
    updateProduct(input: ProductInput!): Product
    deleteProduct(uuid: String!): Boolean
  }

  input ProductInput {
    uuid: String
    name: String!
    description: String!
    thumbnail_source: String!
    price: Float!
  }
`;

const resolvers = {
  Mutation: {
    createProduct: async (_, { input }) => {
      try {
        const { name, description, thumbnail_source, price } = input;
        return await ProductService.create(name, description, thumbnail_source, price);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to create product');
      }
    },
    updateProduct: async (_, { input  }) => {
      try {
        const { uuid, name, description, thumbnail_source, price } = input;
        return await ProductService.update(uuid, name, description, thumbnail_source, price);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to update product');
      }
    },
    deleteProduct: async (_, { uuid }) => {
      try {
        await ProductService.remove(uuid);
        return true;
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to delete product');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
