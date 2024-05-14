import 'dotenv/config'
import './src/sagas/SagaHandlerCtrl.js'

import rollbar from './rollbar.js';
import Sagas from "@vr-web-shop/sagas";
import GraphQLHandler from './src/schemas/base.js'
import FileUploadController from './src/controllers/api/v1/FileUploadController.js';
import SwaggerController from './src/controllers/SwaggerController.js';

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
    //app.use(rollbar.errorHandler())
    origins.forEach(origin => app.use(cors({ origin })));

    /**
     * Add GraphQL endpoint
     */
    app.get('/graphql', GraphQLHandler);
    app.post('/graphql', GraphQLHandler);

    /**
     * Add controllers
     */
    app.use(SwaggerController);
    app.use(FileUploadController)

    /**
     * Start server
     */
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})();
