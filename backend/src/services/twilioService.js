const twilio = require('twilio');
const config = require('../config');
const logger = require('../utils/logger');

let client = null;

function getTwilioClient() {
    if (!client) {
        if (!config.twilio.accountSid || !config.twilio.authToken) {
            logger.error("Twilio credentials (accountSid, authToken) are not set. Please configure them in .env");
            throw new Error("Twilio credentials not configured.");
        }
        client = twilio(config.twilio.accountSid, config.twilio.authToken);
        logger.info("Twilio client initialized.");
    }
    return client;
}

async function sendMessage(to, body) {
    const twilioClient = getTwilioClient();
    // Determine the 'from' number based on sandbox mode
    const fromNumber = config.twilio.sandboxMode ? config.twilio.phoneNumber : config.twilio.phoneNumber;

    if (!fromNumber) {
        logger.error("Twilio phone number not configured.");
        throw new Error("Twilio phone number is not configured.");
    }

    logger.info(`Attempting to send message to ${to} from ${fromNumber}`);

    try {
        const message = await twilioClient.messages.create({
            body: body,
            from: fromNumber, // The Twilio Sandbox number or your WABA number
            to: to,           // The recipient's WhatsApp number (e.g., a registered user's number)
        });
        logger.info(`Message sent successfully: ${message.sid}`);
        return message;
    } catch (error) {
        logger.error(`Error sending Twilio message to ${to}:`, error.message);
        // Log more details if available, e.g., error.code, error.moreInfo
        if (error.code === 21211) { // Invalid 'To' number
            logger.error(`Invalid 'To' number: ${to}. Ensure it's a valid WhatsApp-enabled number.`);
        } else if (error.code === 21614) { // Not a WhatsApp number
             logger.error(`Number ${to} is not enabled for WhatsApp. Please ensure it's correctly formatted and opted-in.`);
        }
        throw error;
    }
}

module.exports = {
    sendMessage,
    // You would also add methods here to handle message receipts, status updates, etc.
};
