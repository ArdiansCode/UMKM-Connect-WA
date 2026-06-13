const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Import route handlers
const authRoutes = require('./authRoutes');        // For registration and login
const chatRoutes = require('./chatRoutes');        // For handling WhatsApp messages and chat logic

// Define API routes
router.use('/auth', authRoutes);        // API routes for authentication
router.use('/chat', chatRoutes);        // API routes for chat processing

// Health check route for the API
router.get('/health', (req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'OK', message: 'API is healthy' });
});

// Fallback route for anything not matched
router.use('*', (req, res) => {
    logger.warn(`Unhandled route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: 'API endpoint not found.' });
});

module.exports = router;
