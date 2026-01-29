const express = require('express');
const router = express.Router();
const { login, registerCustomer } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', registerCustomer);

module.exports = router;
