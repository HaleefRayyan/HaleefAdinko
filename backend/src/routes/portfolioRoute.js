const express = require('express');

const router = express.Router();

const { 
    getAllPortfolio, 
    createNewPortfolio, 
    updatePortfolio, 
    deletePortfolio 
} = require('../controller/portfolio');

router.get('/', getAllPortfolio);

router.post('/', createNewPortfolio);

router.put('/:id', updatePortfolio);

router.delete('/:id', deletePortfolio);

module.exports = router;