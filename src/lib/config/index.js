export default {
  port: process.env.PORT || 3001,
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  fonnte: {
    apiKey: process.env.FONNTE_API_KEY,
    phoneNumber: process.env.FONNTE_PHONE_NUMBER,
    apiUrl: process.env.FONNTE_API_URL || 'https://api.fonnte.com',
    countryCode: process.env.FONNTE_COUNTRY_CODE || '62',
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },
};
