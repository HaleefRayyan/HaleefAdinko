const express = require('express');

const router = express.Router();

const { 
    getKategori, 
    createNewKategori, 
    updateKategori, 
    deleteKategori 
} = require('../controller/kategori');

router.get('/', getKategori);

router.post('/', createNewKategori);

router.put('/:id', updateKategori);

router.delete('/:id', deleteKategori);

module.exports = router;