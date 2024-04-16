const typeDef = `
    type ProductOrderState {
        name: String!
        created_at: String
        updated_at: String
    }

    type ProductOrderStates {
        rows: [ProductOrderState]
        pages: Float
        count: Float
    }

    union ProductOrderStatesResult = ProductOrderStates | RequestError
    union ProductOrderStateResult = ProductOrderState | RequestError

    type Query {
        productOrderStates(limit: Float, page: Float): ProductOrderStatesResult
        productOrderState(name: String!): ProductOrderStateResult
    }

    type Mutation {
        createProductOrderState(input: OrderStateInput!): ProductOrderStateResult
    }  

    input OrderStateInput {
        name: String!
    }
`;

export default typeDef;
