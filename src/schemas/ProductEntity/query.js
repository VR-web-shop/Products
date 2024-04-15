import ProductEntityService from "../../services/ProductEntityService.js";

const typeDef = `
  type ProductEntity {
    uuid: String
    product_entity_state_name: String!
    product_uuid: String!
  }

  type Query {
    productEntities(limit: Float, offset: Float): [ProductEntity]
    productEntity(uuid: String!): ProductEntity
  }
`;

const resolvers = {
  Query: {
    productEntities: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductEntityService.findAll(limit, offset);
        } catch (error) {
            console.log('error', error);
            throw new Error('Failed to get product entities');
        }
    },
    productEntity: async (_, { uuid }) => {
      try {
        return await ProductEntityService.find(uuid);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to get product entity');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
