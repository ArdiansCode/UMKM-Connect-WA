const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Import route handlers
const authRoutes = require('./authRoutes');
const chatRoutes = require('./chatRoutes');
const adminRoutes = require('./adminRoutes');

// Define API routes
router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);

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
