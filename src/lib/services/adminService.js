import { getClient } from "../config/supabaseClient";
const supabase = getClient();

const getAdminStats = async () => {
    try {
        // Hitung total user
        const { count: totalUsers, error: userError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (userError) throw userError;

        // Hitung total pesan
        const { count: totalMessages, error: msgError } = await supabase
            .from('chat_memories')
            .select('*', { count: 'exact', head: true });

        if (msgError) throw msgError;

        // Hitung pesan per user (contoh 5 user teraktif)
        const { data: userActivity, error: activityError } = await supabase
            .from('chat_memories')
            .select('user_id, users(name, whatsapp_number)')
            .order('created_at', { ascending: false });

        if (activityError) throw activityError;

        // Proses data untuk menghitung jumlah pesan per user
        const activityMap = {};
        userActivity.forEach(msg => {
            const userName = msg.users ? msg.users.name : 'Unknown';
            activityMap[userName] = (activityMap[userName] || 0) + 1;
        });

        // Ubah ke array dan urutkan
        const topUsers = Object.entries(activityMap)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
            
        return {
            totalUsers,
            totalMessages,
            topUsers
        };
    } catch (error) {
        throw error;
    }
};

export default { getAdminStats };
