const express = require('express');
const router = express.Router();

const {
    getSiteSettings,
    updateSiteSettings,
    getHomeSettings,
    updateHomeSettings
} = require('../controller/admin');

router.get('/site-settings', getSiteSettings);
router.put('/site-settings', updateSiteSettings);
router.get('/home-settings', getHomeSettings);
router.put('/home-settings', updateHomeSettings);

module.exports = router;
