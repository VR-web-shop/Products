import ProductOrderEntityService from "../../services/ProductOrderEntityService.js";

const typeDef = `
  type Mutation {
    createProductOrderEntity(input: ProductOrderEntityInput!): ProductOrderEntity
    updateProductOrderEntity(input: ProductOrderEntityInput!): ProductOrderEntity
    deleteProductOrderEntity(uuid: String!): Boolean
  }

  input ProductOrderEntityInput {
    uuid: String
    product_order_uuid: String! 
    product_entity_uuid: String!
  }
`;

const resolvers = {
  Mutation: {
    createProductOrderEntity: async (_, { input }) => {
      try {
        const { product_order_uuid, product_entity_uuid } = input;
        return await ProductOrderEntityService.create(product_order_uuid, product_entity_uuid);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to create product order entity');
      }
    },
    updateProductOrderEntity: async (_, { input  }) => {
      try {
        const { uuid, product_order_uuid, product_entity_uuid } = input;
        return await ProductOrderEntityService.update(uuid, product_order_uuid, product_entity_uuid);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to update product order entity');
      }
    },
    deleteProductOrderEntity: async (_, { uuid }) => {
      try {
        await ProductOrderEntityService.remove(uuid);
        return true;
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to delete product order entity');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
