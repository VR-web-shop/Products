import StorageService from '../../../services/StorageService.js';
import LinkService from '../../../services/LinkService.js';
import MiddlewareJWTRest from "../../../jwt/MiddlewareJWTRest.js";
import express from 'express';
import multer from "multer";
import RequestError from '../../../schemas/RequestError/RequestError.js';
import rollbar from '../../../../rollbar.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const newKey = (clientSideUUID, version, ending) => `${clientSideUUID}_${version}.${ending}`;

router.use(MiddlewareJWTRest.AuthorizeJWT);
router.use(MiddlewareJWTRest.AuthorizePermissionJWT("products:put:upload"))

/**
 * @openapi
 * '/api/v1/upload':
 * post:
 *  tags:
 *   - File Upload Controller
 * summary: Upload a file
 * requestBody:
 *  required: true
 *  content:
 *   multipart/form-data:
 *    schema:
 *     type: object
 *     properties:
 *      file:
 *       type: string
 *       format: binary
 *      clientSideUUID:
 *       type: string
 *      version:
 *       type: string
 *      oldURL:
 *       type: string
 *      prefix:
 *       type: string
 * responses:
 *  200:
 *   description: OK
 *   content:
 *    application/json:
 *     schema:
 *      type: object
 *      properties:
 *       url:
 *        type: string
 *  400:
 *   description: Bad Request
 *  500:
 *  description: Internal Server Error
 */
router.post('/api/v1/upload', upload.single('file'), async (req, res) => {
    try {
        const { clientSideUUID, version, oldURL, prefix } = req.body;
        const { file } = req;
        
        if (!file) return res.status(400).send('No file uploaded');
        if (!clientSideUUID) return res.status(400).send('No clientSideUUID provided');
        if (!version) return res.status(400).send('No version provided');
        if (!prefix) return res.status(400).send('No prefix provided');

        const ending = file.originalname.split('.').pop();
        const key = newKey(clientSideUUID, version, ending);
        const storage = new StorageService(prefix);
        const url = await storage.uploadFile(file.buffer, key)

        // Delete old version if it exists and provided
        // And if the new version is uploaded successfully
        if (url && oldURL) {
            const oldKey = storage.parseKey(oldURL);
            await storage.deleteFile(oldKey);
        }

        res.send({ 
            url,
            ...LinkService.entityLinks(`api/v1/upload`, 'GET') 
        });
    } catch (error) {
        if (error instanceof RequestError) {
            rollbar.info('RequestError', { code: error.code, message: error.message })
            return res.status(error.code).send({ message: error.message })
        }

        rollbar.error(error)
        console.error(error)
        return res.status(500).send({ message: 'Internal Server Error' })
    }
});

export default router;
