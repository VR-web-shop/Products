import APIActorError from "../errors/APIActorError.js";
import ProductEntityService from "../../../services/ProductEntityService.js";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()

router.use(MiddlewareJWT.AuthorizeJWT)

router.route('/api/v1/product_entity/:uuid')
    /**
     * @openapi
     * '/api/v1/product_entity/:uuid':
     *  get:
     *     tags:
     *       - Product Entity Controller
     *     summary: Get product entity by UUID
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *     - in: path
     *       name: uuid
     *       schema:
     *        type: string
     *       required: true
     *       description: UUID of the product entity
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
     *              state:
     *               type: string
     *              product_uuid:
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
    .get(MiddlewareJWT.AuthorizePermissionJWT('product-entities:show'), async (req, res) => {
        try {
            const request = new ProductEntityService.ProductEntityRequest.FindRequest(req.params)
            const response = await ProductEntityService.find(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

router.route('/api/v1/product_entities')
    /**
     * @openapi
     * '/api/v1/product_entities':
     *  get:
     *     tags:
     *       - Product Entity Controller
     *     summary: Get all product entities
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *     - in: query
     *       name: page
     *       schema:
     *        type: integer
     *       required: false
     *       description: Page number
     *     - in: query
     *       name: limit
     *       schema:
     *          type: integer
     *       required: false
     *       description: Limit of items per page
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object   
     *             properties:
     *              pages:
     *               type: integer
     *              response:
     *               type: array
     *               items:
     *                properties:
     *                 uuid:
     *                  type: string
     *                 state:
     *                  type: string
     *                 product_uuid:
     *                  type: string
     *                 created_at:
     *                  type: string
     *                 updated_at:
     *                  type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(MiddlewareJWT.AuthorizePermissionJWT('product-entities:index'), async (req, res) => {
        try {
            const request = new ProductEntityService.ProductEntityRequest.FindAllRequest(req.query)
            const {product_entities, pages} = await ProductEntityService.findAll(request)
            res.send({product_entities, pages})
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
     * '/api/v1/product_entities':
     *  post:
     *     tags:
     *       - Product Entity Controller
     *     summary: Create a product entity
     *     security:
     *      - bearerAuth: []
     *     requestBody:
     *      required: true
     *      content:
     *       application/json:
     *        schema:
     *         type: object
     *         properties:
     *          product_uuid:
     *           type: string
     *           required: true
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
     *              state:
     *               type: string
     *              product_uuid:
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
    .post(MiddlewareJWT.AuthorizePermissionJWT('product-entities:create'), async (req, res) => {
        try {
            const request = new ProductEntityService.ProductEntityRequest.CreateRequest(req.body)
            const response = await ProductEntityService.create(request)
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
     * '/api/v1/product_entities':
     *  put:
     *     tags:
     *       - Product Entity Controller
     *     summary: Update a product entity
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
     *          product_uuid:
     *           type: string
     *           required: true
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
     *              state:
     *               type: string
     *              product_uuid:
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
    .put(MiddlewareJWT.AuthorizePermissionJWT('product-entities:update'), async (req, res) => {
        try {
            const request = new ProductEntityService.ProductEntityRequest.UpdateRequest(req.body)
            const response = await ProductEntityService.update(request)
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
     * '/api/v1/product_entities':
     *  delete:
     *     tags:
     *       - Product Entity Controller
     *     summary: Delete a product entity
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
    .delete(MiddlewareJWT.AuthorizePermissionJWT('product-entities:delete'), async (req, res) => {
        try {
            const request = new ProductEntityService.ProductEntityRequest.DeleteRequest(req.body)
            await ProductEntityService.destroy(request)
            res.send(203)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
