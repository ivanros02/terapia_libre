const express = require('express');
const router = express.Router();
const googleAuthController = require('../controllers/googleAuth.controller');

router.get('/auth/google', googleAuthController.authGoogle);
router.get('/auth/google/callback', googleAuthController.googleCallback);

module.exports = router;
