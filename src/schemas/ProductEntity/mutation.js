import ProductEntityService from "../../services/ProductEntityService.js";

const typeDef = `
  type Mutation {
    createProductEntity(input: ProductEntityInput!): ProductEntity
    updateProductEntity(input: ProductEntityInput!): ProductEntity
    deleteProductEntity(uuid: String!): Boolean
  }

  input ProductEntityInput {
    uuid: String
    product_entity_state_name: String!
    product_uuid: String!
  }
`;

const resolvers = {
  Mutation: {
    createProductEntity: async (_, { input }) => {
      try {
        const { product_entity_state_name, product_uuid } = input;
        return await ProductEntityService.create(product_entity_state_name, product_uuid);
      } catch (error) {
        throw new Error('Failed to create product entity');
      }
    },
    updateProductEntity: async (_, { input  }) => {
      try {
        const { uuid, product_entity_state_name, product_uuid } = input;
        return await ProductEntityService.update(uuid, product_entity_state_name, product_uuid);
      } catch (error) {
        throw new Error('Failed to update product entity');
      }
    },
    deleteProductEntity: async (_, { uuid }) => {
      try {
        await ProductEntityService.remove(uuid);
        return true;
      } catch (error) {
        throw new Error('Failed to delete product entity');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
