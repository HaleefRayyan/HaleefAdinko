const express = require('express');

const router = express.Router();

const { 
    getAllContacts, 
    createNewContact, 
    updateContact, 
    deleteContact 
} = require('../controller/contact');

router.get('/', getAllContacts);

router.post('/', createNewContact);

router.put('/:id', updateContact);

router.delete('/:id', deleteContact);

module.exports = router;