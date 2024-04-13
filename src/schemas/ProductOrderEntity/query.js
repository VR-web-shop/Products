import ProductOrderEntityService from "../../services/ProductOrderEntityService.js";

const typeDef = `
  type ProductOrderEntity {
    uuid: String
    product_order_uuid: String! 
    product_entity_uuid: String!
  }

  type Query {
    productOrderEntities: [ProductOrderEntity]
    productOrderEntity(uuid: String!): ProductOrderEntity
  }
`;

const resolvers = {
  Query: {
    productOrderEntities: async (_, {limit=10, offset=0}) => {
        try {
            return await ProductOrderEntityService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get product order entities');
        }
    },
    productOrderEntity: async (_, { uuid }) => {
      try {
        return await ProductOrderEntityService.find(uuid);
      } catch (error) {
        throw new Error('Failed to get product order entity');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
