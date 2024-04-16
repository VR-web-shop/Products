const typeDef = `
    type DeliverOption {
        clientSideUUID: String!
        name: String!
        price: Float!
        created_at: String
        updated_at: String
    }

    type DeliverOptions {
        rows: [DeliverOption]
        pages: Float
        count: Float
    }

    union DeliverOptionsResult = DeliverOptions | RequestError
    union DeliverOptionResult = DeliverOption | RequestError

    type Query {
        deliverOptions(limit: Float, page: Float): DeliverOptionsResult
        deliverOption(clientSideUUID: String!): DeliverOptionResult
    }

    type Mutation {
        putDeliverOption(input: DeliverOptionInput!): DeliverOptionResult
        deleteDeliverOption(clientSideUUID: String!): BoolResult
    }  
    
    input DeliverOptionInput {
        clientSideUUID: String!
        name: String!
        price: Float!
    }
`;

export default typeDef;
