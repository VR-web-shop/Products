import APIActorError from "../errors/APIActorError.js";
import ProductService from "../../../services/ProductService.js";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()

router.use(MiddlewareJWT.AuthorizeJWT)

router.route('/api/v1/product/:uuid')
    /**
     * @openapi
     * '/api/v1/product/:uuid':
     *  get:
     *     tags:
     *       - Product Controller
     *     summary: Get product by UUID
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *     - in: path
     *       name: uuid
     *       schema:
     *        type: string
     *       required: true
     *       description: UUID of the product
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *              uuid:
     *               type: string
     *              name:
     *               type: string
     *              description:
     *               type: string
     *              created_at:
     *               type: string
     *              updated_at:
     *               type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(MiddlewareJWT.AuthorizePermissionJWT('products:show'), async (req, res) => {
        try {
            const request = new ProductService.ProductRequest.FindRequest(req.params)
            const response = await ProductService.find(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

router.route('/api/v1/products')
    /**
     * @openapi
     * '/api/v1/products':
     *  get:
     *     tags:
     *       - Product Controller
     *     summary: Get all products
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *     - in: query
     *       name: page
     *       schema:
     *        type: integer
     *       required: false
     *       description: Page number
     *       default: 0
     *     - in: query
     *       name: limit
     *       schema:
     *          type: integer
     *       required: false
     *       description: Limit of items per page
     *       default: 10
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *            type: object   
     *            properties:
     *             pages:
     *               type: integer
     *             response:
     *              type: array
     *              items:
     *               properties:
     *                uuid:
     *                 type: string
     *                name:
     *                 type: string
     *                description:
     *                 type: string
     *                created_at:
     *                 type: string
     *                updated_at:
     *                 type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(MiddlewareJWT.AuthorizePermissionJWT('products:index'), async (req, res) => {
        try {
            const request = new ProductService.ProductRequest.FindAllRequest(req.query)
            const {products, pages} = await ProductService.findAll(request)
            res.send({products, pages})
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
     * @openapi
     * '/api/v1/products':
     *  post:
     *     tags:
     *       - Product Controller
     *     summary: Create a product
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         type: object
     *         properties:
     *          name:
     *           type: string
     *           required: true
     *           default: "Product Name"
     *          description:
     *           type: string
     *           required: true
     *           default: "Product Description"
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *              uuid:
     *               type: string
     *              name:
     *               type: string
     *              description:
     *               type: string
     *              created_at:
     *               type: string
     *              updated_at:
     *               type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .post(MiddlewareJWT.AuthorizePermissionJWT('products:create'), async (req, res) => {
        try {
            const request = new ProductService.ProductRequest.CreateRequest(req.body)
            const response = await ProductService.create(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
     * @openapi
     * '/api/v1/products':
     *  put:
     *     tags:
     *       - Product Controller
     *     summary: Update a product
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         type: object
     *         properties:
     *          uuid:
     *           type: string
     *           required: true
     *           default: "Product UUID"
     *          name:
     *           type: string
     *           default: "Product Name"
     *          description:
     *           type: string
     *           default: "Product Description"
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *              uuid:
     *               type: string
     *              name:
     *               type: string
     *              description:
     *               type: string
     *              created_at:
     *               type: string
     *              updated_at:
     *               type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .put(MiddlewareJWT.AuthorizePermissionJWT('products:update'), async (req, res) => {
        try {
            const request = new ProductService.ProductRequest.UpdateRequest(req.body)
            const response = await ProductService.update(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
     * @openapi
     * '/api/v1/products':
     *  delete:
     *     tags:
     *       - Product Controller
     *     summary: Delete a product
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         type: object
     *         properties:
     *          uuid:
     *           type: string
     *     responses:
     *      203:
     *        description: No Content
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .delete(MiddlewareJWT.AuthorizePermissionJWT('products:delete'), async (req, res) => {
        try {
            const request = new ProductService.ProductRequest.DeleteRequest(req.body)
            await ProductService.destroy(request)
            res.send(204)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
