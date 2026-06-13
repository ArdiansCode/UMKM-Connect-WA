const fonnteService = require('../services/fonnteService');
const geminiService = require('../services/geminiService');
const userService = require('../services/userService');
const transactionService = require('../services/transactionService');
const chatMemoryService = require('../services/chatMemoryService'); // Tambahkan ini
const logger = require('../utils/logger');
// const config = require('../config'); // Not strictly needed here unless using config directly

// --- Handler functions definition ---
// Hapus handlePemasaran, handleKeuangan, handleGeneralQuery karena sudah digantikan logika di dalam processIncomingMessage

// Logika sanitasi pesan agar tidak mengandung data sensitif di log
const sanitizeLog = (data) => {
    if (typeof data === 'string') {
        return data.replace(/(\+?62|08)\d{7,11}/g, '[REDACTED_PHONE]');
    }
    return data;
};

// ... di dalam prosesIncomingMessage ...
    logger.info(`Received message via Fonnte (ID: ${messageIdentifier}) from ${sanitizeLog(senderWhatsAppNumber)}`);

// ... di dalam catch block ...
    logger.error(`Error processing message from ${sanitizeLog(senderWhatsAppNumber)}:`, error.message);
        
        if (!user) {
            // ... (logika registrasi tetap sama) ...
            return res.status(200).send("User registered. Please type /menu to continue.");
        }

        // --- TAMBAHKAN LOGIKA MEMORY DI SINI ---
        const history = await chatMemoryService.getHistory(user.id);
        
        // Simpan pesan user ke memori
        await chatMemoryService.saveMessage(user.id, 'user', userMessage);

        // Konteks Profil UMKM
        const userContext = `Anda adalah asisten UMKM yang mengenal pemilik bernama ${user.name} dari usaha ${user.business_name} (${user.business_type}). Gunakan informasi ini untuk memberikan saran yang relevan. `;

        let responseText = "Maaf, saya tidak mengerti permintaan Anda. Coba ketik /menu.";
        const lowerCaseMessage = userMessage.toLowerCase().trim();

        // Gunakan history saat memanggil fungsi handle
        const getGeminiReply = async (prompt, history) => {
            return await geminiService.generateContentWithHistory(userContext + prompt, history);
        };

        // Logika agar lebih fleksibel
        logger.info(`Processing user message: ${userMessage} for user: ${user.name}`);
        
        // Update bagian logika if-else untuk menggunakan fungsi dengan history & context
        if (lowerCaseMessage.includes('/menu') || lowerCaseMessage.includes('menu')) {
            responseText = `Halo ${user.name || 'Pemilik UMKM'}! 👋\n` +
                           `Sistem kami mencatat usaha Anda adalah ${user.business_name} (${user.business_type}).\n` +
                           `Silakan pilih menu yang Anda butuhkan:\n\n` +
                           `📈 Pemasaran & Konten (Ketik: /pemasaran)\n` +
                           `💰 Keuangan (Ketik: /keuangan)\n` +
                           `❓ Bantuan (Ketik: /bantuan)`;
        } else if (lowerCaseMessage.includes('/pemasaran') || lowerCaseMessage.includes('pemasaran')) {
            responseText = await getGeminiReply(`Berikan saran pemasaran singkat untuk usaha ${user.business_name}: ${userMessage}`, history);
        } else if (lowerCaseMessage.includes('/keuangan') || lowerCaseMessage.includes('keuangan')) {
            responseText = await getGeminiReply(`Berikan saran keuangan singkat untuk usaha ${user.business_name}: ${userMessage}`, history);
        } else if (lowerCaseMessage.includes('/bantuan') || lowerCaseMessage.includes('bantuan')) {
             responseText = "Anda bisa meminta bantuan untuk:\n" +
                            "👉 Pemasaran: Buat caption, ide promosi.\n" +
                            "👉 Keuangan: Tambah pemasukan/pengeluaran, lihat laporan.\n" +
                            "Coba ketik '/menu' untuk kembali.";
        } else {
            responseText = await getGeminiReply(userMessage, history);
        }

        // Simpan respon AI ke memori
        await chatMemoryService.saveMessage(user.id, 'assistant', responseText);

        await fonnteService.sendMessage(senderWhatsAppNumber, responseText);

        res.status(200).send("Message processed successfully.");
    } catch (error) {
        logger.error(`Error processing message from ${senderWhatsAppNumber}:`, error.message);
        try {
            await fonnteService.sendMessage(senderWhatsAppNumber, "Maaf, terjadi kesalahan teknis saat memproses permintaan Anda. Silakan coba lagi nanti."); // <<-- Changed
        } catch (fonnteError) {
            logger.error(`Failed to send error message to ${senderWhatsAppNumber} via Fonnte:`, fonnteError.message); // <<-- Changed
        }
        res.status(500).send("Internal Server Error.");
    }
};

// ... (handlers like handlePemasaran, handleKeuangan, handleGeneralQuery, processChatMessageFromWebUI remain the same) ...

// Process chat messages originating from the Front-end UI simulation
// This function's logic remains the same as it interacts with geminiService and transactionService, not directly with WA messaging API.
const processChatMessageFromWebUI = async (req, res) => {
    const { message } = req.body;
    const mockUserWhatsapp = req.body.whatsappNumber || '+6281298765432'; // Placeholder number for web UI simulation
    
    try {
        let user = await userService.getUserByWhatsAppNumber(mockUserWhatsapp);
        if (!user) {
            logger.info(`User ${mockUserWhatsapp} not found for web UI, creating temporary.`);
            user = await userService.createUser({
                whatsappNumber: mockUserWhatsapp,
                name: "User Web UI",
                businessName: "UMKM Web Demo",
                businessType: "Demo",
            });
            if (!user) throw new Error("Failed to create temporary user for web UI.");
        }
        
        let responseText = "Maaf, saya tidak mengerti permintaan Anda. Coba ketik /menu.";
        const lowerCaseMessage = message.toLowerCase().trim();

        if (lowerCaseMessage === '/menu') {
            responseText = `Halo ${user.name || 'Pengguna Web'}! 👋\nSilakan pilih menu yang Anda butuhkan:\n\n` +
                           `📈 Pemasaran & Konten\n` +
                           `💰 Keuangan\n` +
                           `❓ Bantuan`;
        } else if (lowerCaseMessage.startsWith('/pemasaran')) {
            responseText = await getGeminiReply(`Berikan saran pemasaran singkat untuk usaha ${user.business_name}: ${message}`, history);
        } else if (lowerCaseMessage.startsWith('/keuangan')) {
            responseText = await getGeminiReply(`Berikan saran keuangan singkat untuk usaha ${user.business_name}: ${message}`, history);
        } else if (lowerCaseMessage === '/bantuan') {
             responseText = "Ketik '/menu' untuk melihat daftar fitur.\n" +
                            "Anda bisa meminta bantuan untuk:\n" +
                            "👉 Pemasaran: Buat caption, ide promosi.\n" +
                            "👉 Keuangan: Tambah pemasukan/pengeluaran, lihat laporan.\n" +
                            "Coba ketik '/menu' untuk kembali.";
        } else {
            responseText = await handleGeneralQuery(user, message);
        }

        res.status(200).json({ reply: responseText });

    } catch (error) {
        logger.error(`Error processing chat message from web UI for ${mockUserWhatsapp}:`, error.message);
        res.status(500).json({ message: "An internal error occurred while processing your chat." });
    }
};

const getChatHistory = async (req, res) => {
    // Implementasi placeholder jika fungsi memang dibutuhkan
    res.status(501).send("Not implemented yet");
};

// Re-exporting all functions
module.exports = {
    processIncomingMessage, 
    processChatMessageFromWebUI, 
    getChatHistory,
};
