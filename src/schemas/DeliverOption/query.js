import DeliverOptionService from "../../services/DeliverOptionService.js";

const typeDef = `
  type DeliverOption {
    name: String!
    price: Float!
  }

  type Query {
    deliverOptions: [DeliverOption]
    deliverOption(name: String!): DeliverOption
  }
`;

const resolvers = {
  Query: {
    deliverOptions: async (_, {limit=10, offset=0}) => {
        try {
            return await DeliverOptionService.findAll(limit, offset);
        } catch (error) {
            throw new Error('Failed to get deliver options');
        }
    },
    deliverOption: async (_, { name }) => {
      try {
        return await DeliverOptionService.find(name);
      } catch (error) {
        throw new Error('Failed to get deliver option');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
