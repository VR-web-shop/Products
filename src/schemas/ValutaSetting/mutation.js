import ValutaSettingService from "../../services/ValutaSettingService.js";

const typeDef = `
  type Mutation {
    createValutaSetting(input: ValutaSettingInput!): ValutaSetting
    updateValutaSetting(input: ValutaSettingInput!): ValutaSetting
    deleteValutaSetting(name: String!): Boolean
  }

  input ValutaSettingInput {
    name: String!
    short: String!
    symbol: String!
    active: Boolean
  }
`;

const resolvers = {
  Mutation: {
    createValutaSetting: async (_, { input }) => {
      try {
        const { name, short, symbol, active } = input;
        return await ValutaSettingService.create(name, short, symbol, active);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to create valuta setting');
      }
    },
    updateValutaSetting: async (_, { input  }) => {
      try {
        const { name, short, symbol, active } = input;
        return await ValutaSettingService.update(name, short, symbol, active);
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to update valuta setting');
      }
    },
    deleteValutaSetting: async (_, { name }) => {
      try {
        await ValutaSettingService.remove(name);
        return true;
      } catch (error) {
        console.log('error', error);
        throw new Error('Failed to delete valuta setting');
      }
    }
  }
};

export default {
    typeDef,
    resolvers
};
