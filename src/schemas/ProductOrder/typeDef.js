const typeDef = `
    type ProductOrder {
        clientSideUUID: String!
        name: String!
        email: String!
        address: String!
        city: String!
        country: String!
        postal_code: String!
        deliver_option_client_side_uuid: String!
        payment_option_client_side_uuid: String!
        product_order_state_name: String!
        transaction_state_name: String
        transaction_message: String
        created_at: String
        updated_at: String
    }

    type ProductOrders {
        rows: [ProductOrder]
        pages: Float
        count: Float
    }
    
    union ProductOrdersResult = ProductOrders | RequestError
    union ProductOrderResult = ProductOrder | RequestError

    type Query {
        productOrders(limit: Float, page: Float): ProductOrdersResult
        productOrder(clientSideUUID: String!): ProductOrderResult
    }

    type Mutation {
        putProductOrder(input: ProductOrderInput!): ProductOrderResult
        deleteProductOrder(clientSideUUID: String!): BoolResult
    }  

    input ProductOrderInput {
        clientSideUUID: String!
        name: String!
        email: String!
        address: String!
        city: String!
        country: String!
        postal_code: String!
        deliver_option_client_side_uuid: String!
        payment_option_client_side_uuid: String!
        product_order_state_name: String!
    }
`;

export default typeDef;
