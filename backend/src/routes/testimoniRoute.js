const express = require('express');

const router = express.Router();

const { 
    getAllTestimoni, 
    createNewTestimoni, 
    updateTestimoni, 
    deleteTestimoni 
} = require('../controller/testimoni');

router.get('/', getAllTestimoni);

router.post('/', createNewTestimoni);

router.put('/:id', updateTestimoni);

router.delete('/:id', deleteTestimoni);

module.exports = router;