const express = require('express');
const router = express.Router();

const controller = require('../Controllers/AuthController');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/refreshAccessToken', controller.refreshAccesToken);

module.exports = router;