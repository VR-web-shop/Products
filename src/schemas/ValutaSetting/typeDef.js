const typeDef = `
    type ValutaSetting {
        clientSideUUID: String!
        name: String!
        short: String!
        symbol: String!
        active: Boolean
        created_at: String
        updated_at: String
    }

    type ValutaSettings {
        rows: [ValutaSetting]
        pages: Float
        count: Float
    }

    union ValutaSettingsResult = ValutaSettings | RequestError
    union ValutaSettingResult = ValutaSetting | RequestError

    type Query {
        valutaSettings(limit: Float, page: Float): ValutaSettingsResult
        valutaSetting(clientSideUUID: String!): ValutaSettingResult
    }

    type Mutation {
        putValutaSetting(input: ValutaSettingInput!): ValutaSettingResult
        deleteValutaSetting(clientSideUUID: String!): BoolResult
    }  

    input ValutaSettingInput {
        clientSideUUID: String!
        name: String!
        short: String!
        symbol: String!
        active: Boolean
    }
`;

export default typeDef;
