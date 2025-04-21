const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);
router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);
router.get('/forgot-password', authController.getForgotPasswordPage);
router.post('/forgot-password', authController.forgotPassword);
router.get('/logout', authController.logout);

module.exports = router;