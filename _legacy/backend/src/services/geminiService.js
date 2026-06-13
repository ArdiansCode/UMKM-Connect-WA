const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

// Logging untuk memastikan API key terbaca (Hanya log bagian awal untuk keamanan)
const apiKey = config.gemini.apiKey;
console.log("Gemini API Key Loaded:", apiKey ? "Yes (" + apiKey.substring(0, 5) + "...)" : "NO KEY FOUND");

const genAI = new GoogleGenerativeAI(apiKey || "");
let model;

async function getModel() {
    if (!model) {
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set.");
        }
        // Ganti gemini-pro dengan gemini-1.5-flash yang lebih stabil
        model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    }
    return model;
}

async function generateContent(prompt) {
    try {
        const geminiModel = await getModel();
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("DEBUG - Error calling Gemini API:", error.message);
        throw error;
    }
}

async function generateContentWithHistory(prompt, history = []) {
    try {
        const geminiModel = await getModel();
        
        // Format history ke format yang diharapkan Gemini (array dari role & parts)
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
        console.error("DEBUG - Error calling Gemini API with history:", error.message);
        throw error;
    }
}

module.exports = { generateContent, generateContentWithHistory };
