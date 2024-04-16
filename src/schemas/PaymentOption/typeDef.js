const typeDef = `
    type PaymentOption {
        clientSideUUID: String!
        name: String!
        price: Float!
        created_at: String
        updated_at: String
    }

    type PaymentOptions {
        rows: [PaymentOption]
        pages: Float
        count: Float
    }

    union PaymentOptionsResult = PaymentOptions | RequestError
    union PaymentOptionResult = PaymentOption | RequestError

    type Query {
        paymentOptions(limit: Float, page: Float): PaymentOptionsResult
        paymentOption(clientSideUUID: String!): PaymentOptionResult
    }

    type Mutation {
        putPaymentOption(input: PaymentOptionInput!): PaymentOptionResult
        deletePaymentOption(clientSideUUID: String!): BoolResult
    }  
    
    input PaymentOptionInput {
        clientSideUUID: String!
        name: String!
        price: Float!
    }
`;

export default typeDef;
