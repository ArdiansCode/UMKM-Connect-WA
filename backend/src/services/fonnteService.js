const axios = require('axios');
const FormData = require('form-data'); // For multipart/form-data body
const config = require('../config');
const logger = require('../utils/logger');

// Helper to retrieve Fonnte config from env via config module
async function getFonnteConfig() {
    const apiKey = config.fonnte.apiKey;
    const phoneNumber = config.fonnte.phoneNumber; // May not be needed for sending, but keep for reference
    const apiUrl = config.fonnte.apiUrl || 'https://api.fonnte.com';
    const defaultCountryCode = config.fonnte.countryCode || '62'; // Default country code (Indonesia)
    if (!apiKey) {
        logger.error('Fonnte API key is missing. Please set FONNTE_API_KEY in .env');
        throw new Error('Fonnte configuration missing');
    }
    return { apiKey, phoneNumber, apiUrl, defaultCountryCode };
}

/**
 * Send a WhatsApp text message via Fonnte API.
 * @param {string} to          Target phone number (e.g., "08123456789" or "628123456789")
 * @param {string} body        Message content (plain text)
 * @returns {Promise<Object>}   Returns the response data from Fonnte (e.g., message_id, status)
 */
function stripMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // bold **word** -> word
        .replace(/\*(.*?)\*/g, '$1')     // italic *word* -> word
        .replace(/#{1,6}\s/g, '')        // remove headers #, ##, etc.
        .replace(/`(.*?)`/g, '$1')       // inline code `code` -> code
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // link [text](url) -> text
        .trim();
}

async function sendMessage(to, body) {
    const { apiKey, apiUrl, defaultCountryCode } = await getFonnteConfig();
    
    // Bersihkan Markdown sebelum dikirim
    const cleanBody = stripMarkdown(body);
    
    // Bersihkan nomor: hapus spasi/strip
    let targetNumber = to.toString().replace(/[\s-]/g, '');
    
    // Jika nomor diawali '62' (kode negara), jangan tambah kode negara lagi
    if (targetNumber.startsWith(defaultCountryCode)) {
        // Sudah benar, biarkan saja
    } 
    // Jika nomor diawali '0', ganti dengan kode negara
    else if (targetNumber.startsWith('0')) {
        targetNumber = defaultCountryCode + targetNumber.substring(1);
    } 
    // Jika nomor tidak diawali '62' (kode negara), tambahkan kode negara
    else {
        targetNumber = defaultCountryCode + targetNumber;
    }
    
    // Pastikan tidak ada karakter '+' (Fonnte kadang tidak suka)
    targetNumber = targetNumber.replace('+', '');

    logger.info(`Preparing to send Fonnte message to ${targetNumber}`);

    const form = new FormData();
    form.append('target', targetNumber);
    form.append('message', cleanBody);
    // Optional: include countryCode if you want to be explicit (Fonnte can infer from target)
    form.append('countryCode', defaultCountryCode);

    try {
        const response = await axios.post(`${apiUrl}/send`, form, {
            headers: {
                ...form.getHeaders(), // Includes correct multipart boundary
                'Authorization': apiKey, // Token in header, per Fonnte docs
            },
            maxBodyLength: Infinity,
        });
        // Fonnte bisa mengembalikan status: true atau 'success'
        if (response.data && (response.data.status === 'success' || response.data.status === true)) {
            logger.info(`Fonnte message sent successfully. ID: ${response.data.message_id || 'N/A'}`);
            return response.data;
        } else {
            logger.error('Fonnte API responded with non-success status:', response.data);
            throw new Error(response.data?.message || 'Fonnte API error');
        }
    } catch (error) {
        logger.error(`Error sending message via Fonnte to ${targetNumber}:`, error.message);
        if (error.response) {
            logger.error('Fonnte response error data:', error.response.data);
        }
        throw error;
    }
}

module.exports = {
    sendMessage,
};
