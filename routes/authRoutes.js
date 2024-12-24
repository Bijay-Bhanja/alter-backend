const express = require('express');
const { googleSignIn } = require('../controllers/authController');
const router = express.Router();

/**
 * @route POST /auth/google
 * @desc Authenticate user using Google Sign-In
 */
router.post('/google', googleSignIn);

module.exports = router;
