const typeDef = `
    type ProductOrderEntity {
        clientSideUUID: String!
        product_order_uuid: String! 
        product_entity_uuid: String!
        created_at: String
        updated_at: String
    }

    type ProductOrderEntities {
        rows: [ProductOrderEntity]
        pages: Float
        count: Float
    }
    
    union ProductOrderEntitiesResult = ProductOrderEntity | RequestError
    union ProductOrderEntityResult = ProductOrderEntity | RequestError

    type Query {
        productOrderEntities(limit: Float, page: Float): ProductOrderEntitiesResult
        productOrderEntity(clientSideUUID: String!): ProductOrderEntityResult
    }

    type Mutation {
        putProductOrderEntity(input: ProductOrderEntityInput!): ProductOrderEntityResult
        deleteProductOrderEntity(clientSideUUID: String!): BoolResult
    }  

    input ProductOrderEntityInput {
        clientSideUUID: String!
        product_order_uuid: String! 
        product_entity_uuid: String!
    }
`;

export default typeDef;
