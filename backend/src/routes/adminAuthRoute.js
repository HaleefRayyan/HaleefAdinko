const express = require('express');
const router = express.Router();

const { loginAdmin } = require('../controller/adminAuth');

router.post('/login', loginAdmin);

module.exports = router;
