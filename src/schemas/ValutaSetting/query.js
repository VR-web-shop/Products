import ValutaSettingService from "../../services/ValutaSettingService.js";

const typeDef = `
  type ValutaSetting {
    name: String!
    short: String!
    symbol: String!
    active: Boolean
  }

  type Query {
    valutaSettings(limit: Float, offset: Float): [ValutaSetting]
    valutaSetting(name: String!): ValutaSetting
  }
`;

const resolvers = {
  Query: {
    valutaSettings: async (_, {limit=10, offset=0}) => {
        try {
          return await ValutaSettingService.findAll(limit, offset);
        } catch (error) {
          console.log('error', error);
          throw new Error('Failed to get valuta setting');
        }
    },
    valutaSetting: async (_, { name }) => {
      try {
        return await ValutaSettingService.find(name);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to get valuta setting');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
