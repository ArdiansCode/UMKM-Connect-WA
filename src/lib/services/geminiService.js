import { GoogleGenerativeAI } from '@google/generative-ai';

let model = null;

function getModel() {
    if (!model) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set.");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    }
    return model;
}

async function generateContent(prompt) {
    try {
        const geminiModel = getModel();
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
        throw error;
    }
}

async function generateContentWithHistory(prompt, history = []) {
    try {
        const geminiModel = getModel();
        
        // Filter history agar selalu dimulai dengan role 'user'
        // Jika pesan pertama adalah 'model', kita buang (atau abaikan)
        let formattedHistory = history.map(h => ({
            role: h.sender_role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.message }]
        }));

        // Pastikan history pertama adalah 'user'
        if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
            formattedHistory = formattedHistory.slice(1);
        }

        const chat = geminiModel.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
            },
        });

        const promptWithInstruction = `Jawablah secara singkat, padat, dan langsung pada intinya. ${prompt}`;
        const result = await chat.sendMessage(promptWithInstruction);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API with history:", error.message);
        throw error;
    }
}

export default { generateContent, generateContentWithHistory };
