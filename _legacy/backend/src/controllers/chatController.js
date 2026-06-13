const fonnteService = require('../services/fonnteService');
const geminiService = require('../services/geminiService');
const userService = require('../services/userService');
const chatMemoryService = require('../services/chatMemoryService');
const logger = require('../utils/logger');

const sanitizeLog = (data) => {
    if (typeof data === 'string') return data.replace(/(\+?62|08)\d{7,11}/g, '[REDACTED_PHONE]');
    return data;
};

const processIncomingMessage = async (req, res) => {
    const { sender, message } = req.body; 
    if (!sender || !message) return res.status(400).send("Bad Request");
    
    logger.info(`Received message from ${sanitizeLog(sender)}`);

    try {
        const user = await userService.getUserByWhatsAppNumber(sender);
        if (!user) return res.status(200).send("User not registered.");

        const history = await chatMemoryService.getHistory(user.id);
        await chatMemoryService.saveMessage(user.id, 'user', message);

        const getGeminiReply = async (prompt, hist) => {
            const context = `Anda asisten UMKM untuk ${user.business_name} (${user.business_type}).`;
            return await geminiService.generateContentWithHistory(context + prompt, hist);
        };

        let responseText = "";
        const msg = message.toLowerCase().trim();

        if (msg.includes('/menu')) {
            responseText = `Halo ${user.name}! 👋 Menu:\n📈 /pemasaran\n💰 /keuangan\n❓ /bantuan`;
        } else if (msg.includes('/pemasaran')) {
            responseText = await getGeminiReply(`Saran pemasaran untuk ${message}`, history);
        } else if (msg.includes('/keuangan')) {
            responseText = await getGeminiReply(`Saran keuangan untuk ${message}`, history);
        } else {
            responseText = await getGeminiReply(message, history);
        }

        await chatMemoryService.saveMessage(user.id, 'assistant', responseText);
        await fonnteService.sendMessage(sender, responseText);
        res.status(200).send("OK");
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        res.status(500).send("Error");
    }
};

const processChatMessageFromWebUI = async (req, res) => {
    res.status(200).json({ reply: "Web UI aktif" });
};

module.exports = { processIncomingMessage, processChatMessageFromWebUI };
