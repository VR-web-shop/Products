import StorageService from '../services/StorageService.js';
import express from 'express';
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const newKey = (clientSideUUID, version, ending) => `${clientSideUUID}_${version}.${ending}`;

router.post('/upload', upload.single('file'), async (req, res) => {
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

    res.send({ url });
});

export default router;
