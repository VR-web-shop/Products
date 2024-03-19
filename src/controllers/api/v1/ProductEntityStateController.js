import APIActorError from "../errors/APIActorError.js";
import ProductEntityStateService from "../../../services/ProductEntityStateService.js";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()

router.use(MiddlewareJWT.AuthorizeJWT)

router.route('/api/v1/product_entity_state/:name')
    /**
     * @openapi
     * '/api/v1/product_entity_state/:name':
     *  get:
     *     tags:
     *       - Product Entity State Controller
     *     summary: Get product entity state by name
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *     - in: path
     *       name: name
     *       schema:
     *        type: string
     *       required: true
     *       description: name of the product entity state
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *              name:
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
    .get(MiddlewareJWT.AuthorizePermissionJWT('product-entity-states:show'), async (req, res) => {
        try {
            const request = new ProductEntityStateService.ProductEntityStateRequest.FindRequest(req.params)
            const response = await ProductEntityStateService.find(request)
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

router.route('/api/v1/product_entity_states')
    /**
     * @openapi
     * '/api/v1/product_entity_states':
     *  get:
     *     tags:
     *       - Product Entity State Controller
     *     summary: Get all product entity states
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: query
     *        name: page
     *        schema:
     *         type: integer
     *        required: false
     *        description: Page number
     *      - in: query
     *        name: limit
     *        schema:
     *         type: integer
     *        required: false
     *        description: Limit of items per page
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: array
     *             items:
     *              properties:
     *               name:
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
    .get(MiddlewareJWT.AuthorizePermissionJWT('product-entity-states:index'), async (req, res) => {
        try {
            const request = new ProductEntityStateService.ProductEntityStateRequest.FindAllRequest(req.query)
            const {product_entity_states, pages} = await ProductEntityStateService.findAll(request)
            res.send({product_entity_states, pages})
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
