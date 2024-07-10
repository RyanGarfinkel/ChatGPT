const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../Utils/AuthProvider');
router.use(authenticate);
router.use(authorize);

const controller = require('../Controllers/ChatController');
router.post('/createThread', controller.createThread);
router.post('/completePrompt', controller.completePrompt);
router.post('/changeTitle', controller.changeTitle);

module.exports = router;