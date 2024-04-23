const typeDef = `
    type ProductEntity {
        clientSideUUID: String!
        product_entity_state_name: String!
        product_client_side_uuid: String!
        transaction_state_name: String
        transaction_message: String
        created_at: String
        updated_at: String
    }

    type ProductEntities {
        rows: [ProductEntity]
        pages: Float
        count: Float
    }
    
    union ProductEntitiesResult = ProductEntities | RequestError
    union ProductEntityResult = ProductEntity | RequestError

    type Query {
        productEntities(limit: Float, page: Float): ProductEntitiesResult
        productEntity(clientSideUUID: String!): ProductEntityResult
    }

    type Mutation {
        putProductEntity(input: ProductEntityInput!): ProductEntityResult
        deleteProductEntity(clientSideUUID: String!): BoolResult
    }  

    input ProductEntityInput {
        clientSideUUID: String!
        product_entity_state_name: String!
        product_client_side_uuid: String!
    }
`;

export default typeDef;
