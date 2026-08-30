const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../public/images');

const ensureUploadDir = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

const listMedia = async (req, res) => {
    try {
        ensureUploadDir();
        const files = fs.readdirSync(uploadDir)
            .filter((name) => !name.startsWith('.'))
            .map((name) => ({
                name,
                url: `/assets/${name}`
            }));

        return res.status(200).json({
            message: 'Get media list success',
            data: files
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

const uploadMedia = async (req, res) => {
    try {
        ensureUploadDir();

        if (!req.file) {
            return res.status(400).json({
                message: 'File tidak ditemukan',
                data: null
            });
        }

        return res.status(200).json({
            message: 'Upload media success',
            data: {
                name: req.file.filename,
                url: `/assets/${req.file.filename}`
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

const deleteMedia = async (req, res) => {
    try {
        const { filename } = req.params;
        const targetPath = path.join(uploadDir, filename);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({
                message: 'File tidak ditemukan',
                data: null
            });
        }

        fs.unlinkSync(targetPath);

        return res.status(200).json({
            message: 'Delete media success',
            data: { filename }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

module.exports = {
    listMedia,
    uploadMedia,
    deleteMedia
};
