const typeDef = `
    type Product {
        clientSideUUID: String!
        name: String!
        description: String!
        thumbnail_source: String!
        transaction_state_name: String
        transaction_message: String
        price: Float!
        created_at: String
        updated_at: String
    }

    type Products {
        rows: [Product]
        pages: Float
        count: Float
    }
    
    union ProductsResult = Products | RequestError
    union ProductResult = Product | RequestError

    type Query {
        products(limit: Float, page: Float): ProductsResult
        product(clientSideUUID: String!): ProductResult
    }

    type Mutation {
        putProduct(input: ProductInput!): ProductResult
        deleteProduct(clientSideUUID: String!): BoolResult
    }  

    input ProductInput {
        clientSideUUID: String!
        name: String!
        description: String!
        thumbnail_source: String!
        price: Float!
    }
`;

export default typeDef;
