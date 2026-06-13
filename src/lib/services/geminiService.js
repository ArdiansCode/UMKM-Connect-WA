import { GoogleGenerativeAI } from '@google/generative-ai';

let model = null;

function getModel() {
    if (!model) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set.");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        
        const chatHistory = history.map(h => ({
            role: h.sender_role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.message }]
        }));

        const chat = geminiModel.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.7,
            },
        });

        const promptWithInstruction = `Jawablah secara singkat, padat, dan langsung pada intinya (to the point). Jangan gunakan format markdown yang berlebihan. ${prompt}`;
        const result = await chat.sendMessage(promptWithInstruction);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error calling Gemini API with history:", error.message);
        throw error;
    }
}

export default { generateContent, generateContentWithHistory };
