import axios from 'axios';
import logger from '../utils/logger';

function stripMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/`(.*?)`/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .trim();
}

async function sendMessage(to, body) {
    const apiKey = process.env.FONNTE_API_KEY;
    const apiUrl = process.env.FONNTE_API_URL || 'https://api.fonnte.com';
    const defaultCountryCode = process.env.FONNTE_COUNTRY_CODE || '62';

    if (!apiKey) {
        logger.error('Fonnte API key is missing. Please set FONNTE_API_KEY in environment variables.');
        throw new Error('Fonnte configuration missing');
    }
    
    const cleanBody = stripMarkdown(body);
    
    let targetNumber = to.toString().replace(/[\s-]/g, '');
    
    if (targetNumber.startsWith(defaultCountryCode)) {
        // already correct
    } else if (targetNumber.startsWith('0')) {
        targetNumber = defaultCountryCode + targetNumber.substring(1);
    } else {
        targetNumber = defaultCountryCode + targetNumber;
    }
    
    targetNumber = targetNumber.replace('+', '');

    logger.info(`Preparing to send Fonnte message to ${targetNumber}`);

    // Use URLSearchParams instead of form-data for Next.js compatibility
    const params = new URLSearchParams();
    params.append('target', targetNumber);
    params.append('message', cleanBody);
    params.append('countryCode', defaultCountryCode);

    try {
        const response = await axios.post(`${apiUrl}/send`, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': apiKey,
            },
        });

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

export default {
    sendMessage,
};
