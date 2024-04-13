import 'dotenv/config'

import GraphQLSchema from './src/schemas/base.js'
import MessageBroker from './src/config/BrokerConfig.js';

import { createHandler } from 'graphql-http/lib/use/express';
import express from 'express';
import cors from 'cors';

(async () => {
    /**
     * Connect to message broker
     */
    await MessageBroker.connect();

    /**
     * Create express app
     */
    const app = express();
    const port = process.env.SERVER_PORT;

    /**
     * Configure express
     */
    app.use(cors({origin: '*'}));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    /**
     * Add GraphQL endpoint
     */
    const graphqlHandler = createHandler({
        schema: GraphQLSchema,
    });
    app.get('/graphql', graphqlHandler);
    app.post('/graphql', graphqlHandler);

    /**
     * Start server
     */
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
