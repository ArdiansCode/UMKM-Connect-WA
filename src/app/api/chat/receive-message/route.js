import { NextResponse } from 'next/server';
import fonnteService from '@/lib/services/fonnteService';
import geminiService from '@/lib/services/geminiService';
import userService from '@/lib/services/userService';
import chatMemoryService from '@/lib/services/chatMemoryService';
import logger from '@/lib/utils/logger';

const sanitizeLog = (data) => {
    if (typeof data === 'string') return data.replace(/(\+?62|08)\d{7,11}/g, '[REDACTED_PHONE]');
    return data;
};

export async function POST(req) {
  const rawBody = await req.text(); 
  console.log("--- RAW BODY DITERIMA ---", rawBody);
  try {
    const body = JSON.parse(rawBody);
    const sender = body.sender || body.pengirim;
    const message = body.message || body.pesan;
    
    if (!sender || !message) return new NextResponse("Bad Request", { status: 400 });

    // setTimeout(() => {
    //     processMessage(sender, message).catch(err => logger.error(err));
    // }, 0);

    logger.info(`Received message from ${sanitizeLog(sender)}`);

    await processMessage(sender, message);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    logger.error(`Error in Webhook: ${error.message}`);
    return new NextResponse("Error", { status: 500 });
  }
}

async function processMessage(sender, message) {
  try {
    const user = await userService.getUserByWhatsAppNumber(sender);
    if (!user) {
        logger.info(`User not registered: ${sender}`);
        return;
    }

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
  } catch (error) {
    logger.error(`Error in processMessage: ${error.message}`);
  }
}
