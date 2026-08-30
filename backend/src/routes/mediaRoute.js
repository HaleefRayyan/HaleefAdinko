const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const { listMedia, uploadMedia, deleteMedia } = require('../controller/media');

router.get('/', listMedia);
router.post('/upload', upload.single('image'), uploadMedia);
router.delete('/:filename', deleteMedia);

module.exports = router;
