const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { getProfile } = require('../controllers/adminController');

router.get('/me', auth, role(['admin']), getProfile);

module.exports = router;


