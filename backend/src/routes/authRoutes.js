const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const logger = require('../utils/logger');

// Route for user registration
router.post('/register', authController.registerUser);

// Route for user login removed as requested

// Health check for auth routes (optional)
router.get('/health', (req, res) => {
    logger.info('Auth health check');
    res.status(200).json({ status: 'OK', message: 'Auth API is healthy' });
});

module.exports = router;
