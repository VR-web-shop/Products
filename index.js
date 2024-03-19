import 'dotenv/config'
import express from 'express';

import ProductController from './src/controllers/api/v1/ProductController.js';
import ProductEntityController from './src/controllers/api/v1/ProductEntityController.js';
import ProductEntityStateController from './src/controllers/api/v1/ProductEntityStateController.js';
import SwaggerController from './src/controllers/SwaggerController.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(SwaggerController);
app.use(ProductController);
app.use(ProductEntityController);
app.use(ProductEntityStateController);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
