const typeDef = `
    type ProductEntity {
        clientSideUUID: String!
        product_entity_state_name: String!
        product_uuid: String!
        created_at: String
        updated_at: String
    }

    type ProductEntities {
        rows: [PaymentOption]
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
        product_uuid: String!
    }
`;

export default typeDef;
