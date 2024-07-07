const express= require('express');
const router = express.Router();

const authenticate = require('../Utils/AuthProvider').authenticate;
router.use(authenticate);

const controller = require('../Controllers/UserController');
router.post('/sendVerification', controller.sendVerification);
router.post('/verifyCode', controller.verifyCode);

module.exports = router;