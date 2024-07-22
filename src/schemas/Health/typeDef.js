const typeDef = `
    type Health {
        mysql_connected: Boolean
        broker_connected: Boolean
        api_type: String
        exception_handler: String
    }

    union HealthResult = Health | RequestError

    type Query {
        health: HealthResult
    }
`;

export default typeDef;
