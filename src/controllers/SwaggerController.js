/**
 * @module controllers/api/SwaggerController
 * @description A module that provides the Swagger API documentation
 * @requires module:express
 * @requires module:swagger-ui-express
 * @requires module:swagger-jsdoc
 * @requires module:path
 */
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dir from 'path';
import express from 'express';

const __dirname = dir.resolve();
const router = express.Router()
const port = process.env.SERVER_PORT
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Products API',
            description: "API endpoints for user products and order management.",
            contact: {
                name: "GitHub Repository",
                url: "https://github.com/VR-web-shop/Products"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${port}/`,
                description: "Local server"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        }
    },
    apis: [`${__dirname}/src/controllers/api/v1/*.js`]
}

const swaggerDocument = swaggerJsdoc(options);
router.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
