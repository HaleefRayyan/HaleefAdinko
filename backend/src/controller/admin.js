const adminModel = require('../models/adminModel');

const getSiteSettings = async (req, res) => {
    try {
        const data = await adminModel.getSiteSettings();
        res.status(200).json({
            message: 'Get site settings success',
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

const updateSiteSettings = async (req, res) => {
    try {
        const payload = req.body;
        const data = await adminModel.updateSiteSettings(payload);
        res.status(200).json({
            message: 'Update site settings success',
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

const getHomeSettings = async (req, res) => {
    try {
        const data = await adminModel.getHomeSettings();
        res.status(200).json({
            message: 'Get home settings success',
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

const updateHomeSettings = async (req, res) => {
    try {
        const payload = req.body;
        const data = await adminModel.updateHomeSettings(payload);
        res.status(200).json({
            message: 'Update home settings success',
            data
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server Error',
            serverMessage: error.message
        });
    }
};

module.exports = {
    getSiteSettings,
    updateSiteSettings,
    getHomeSettings,
    updateHomeSettings
};
