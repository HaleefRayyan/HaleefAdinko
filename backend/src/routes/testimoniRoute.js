const express = require('express');

const router = express.Router();

const { 
    getAllTestimoni,
    getGoogleReviews,
    syncGoogleReviews,
    createNewTestimoni, 
    updateTestimoni, 
    deleteTestimoni 
} = require('../controller/testimoni');

router.get('/', getAllTestimoni);

// Google Reviews endpoints (proxied via backend to avoid CORS + API key exposure)
router.get('/google-reviews', getGoogleReviews);
router.post('/sync-google', syncGoogleReviews);

router.post('/', createNewTestimoni);

router.put('/:id', updateTestimoni);

router.delete('/:id', deleteTestimoni);

module.exports = router;