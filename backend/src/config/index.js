const dotenv = require('dotenv');

dotenv.config(); // Load .env file

module.exports = {
  port: process.env.PORT || 3001,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  // Twilio Configuration replaced by Fonnte
  fonnte: {
    apiKey: process.env.FONNTE_API_KEY,
    phoneNumber: process.env.FONNTE_PHONE_NUMBER, // Your Fonnte registered WhatsApp number
    apiUrl: process.env.FONNTE_API_URL,           // Base URL for Fonnte API (e.g., 'https://api.fonnte.com')
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
};
