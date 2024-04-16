const typeDef = `
    type ProductEntityState {
        name: String!
        created_at: String
        updated_at: String
    }

    type ProductEntityStates {
        rows: [ProductEntityState]
        pages: Float
        count: Float
    }
    
    union ProductEntityStatesResult = ProductEntityStates | RequestError
    union ProductEntityStateResult = ProductEntityState | RequestError

    type Query {
        productEntityStates(limit: Float, page: Float): ProductEntityStatesResult
        productEntityState(name: String!): ProductEntityStateResult
    }

    type Mutation {
        createProductEntityState(input: ProductEntityStateInput!): ProductEntityStateResult
    }  

    input ProductEntityStateInput {
        name: String!
    }
`;

export default typeDef;
