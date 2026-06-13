const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Import controllers
const chatController = require('../controllers/chatController');
// Import services needed by controllers
const userService = require('../services/userService'); 
const transactionService = require('../services/transactionService');

// Webhook endpoint for receiving messages (e.g., from Fonnte)
// NOTE: This endpoint needs to be registered in your Fonnte panel as a webhook URL.
// The payload structure MUST match what Fonnte sends. Adapt chatController.processIncomingMessage accordingly.
router.post('/receive-message', async (req, res) => {
    logger.info("Webhook Received (Fonnte?):", JSON.stringify(req.body));
    await chatController.processIncomingMessage(req, res); // Use the processIncomingMessage function
});

// Direct endpoint for the frontend chat simulation to call backend directly
router.post('/process-message', async (req, res) => {
    logger.info("Processing message from Web UI Simulation:", JSON.stringify(req.body));
    await chatController.processChatMessageFromWebUI(req, res);
});

// API route to fetch chat history for a user for the web UI
router.get('/history', async (req, res) => {
    // Use the getChatHistory function exported from the controller
    await chatController.getChatHistory(req, res); 
});

module.exports = router;
