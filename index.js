import 'dotenv/config'

import Sagas from "@vr-web-shop/sagas";
import GraphQLHandler from './src/schemas/base.js'
import FileUploadController from './src/controllers/FileUploadController.js';

import express from 'express';
import cors from 'cors';

(async () => {
    /**
     * Connect to message broker
     */
    await Sagas.BrokerService.connect();

    /**
     * Create express app
     */
    const app = express();
    const port = process.env.SERVER_PORT;
    const origins = process.env.CORS_ORIGINS.split(',');

    /**
     * Configure express
     */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    origins.forEach(origin => app.use(cors({ origin })));

    /**
     * Add file upload endpoint
     */
    app.use(FileUploadController)

    /**
     * Add GraphQL endpoint
     */
    app.get('/graphql', GraphQLHandler);
    app.post('/graphql', GraphQLHandler);

    /**
     * Start server
     */
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
