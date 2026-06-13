const { getClient } = require('../config/supabaseClient');
const logger = require('../utils/logger');

const supabase = getClient();

const saveMessage = async (userId, senderRole, message) => {
    try {
        const { error } = await supabase
            .from('chat_memories')
            .insert([{
                user_id: userId,
                sender_role: senderRole,
                message: message
            }]);

        if (error) throw error;
        logger.info(`Message saved for user ${userId}: ${senderRole}`);
    } catch (error) {
        logger.error(`Error saving message to chat_memories: ${error.message}`);
    }
};

const getHistory = async (userId, limit = 10) => {
    try {
        const { data, error } = await supabase
            .from('chat_memories')
            .select('sender_role, message')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        
        // Balikkan urutan agar dari lama ke baru (format yang disukai LLM)
        return data ? data.reverse() : [];
    } catch (error) {
        logger.error(`Error fetching chat history for user ${userId}: ${error.message}`);
        return [];
    }
};

module.exports = {
    saveMessage,
    getHistory,
};
