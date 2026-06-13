const { createClient } = require('@supabase/supabase-js');
const config = require('./index.js');
const logger = require('../utils/logger.js');

let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    if (!config.supabase.url || !config.supabase.anonKey) {
      logger.error("Supabase URL or Anon Key not configured. Please check .env");
      throw new Error("Supabase is not configured.");
    }
    supabaseClient = createClient(config.supabase.url, config.supabase.anonKey);
    logger.info("Supabase client initialized.");
  }
  return supabaseClient;
}

module.exports = {
  getClient: getSupabaseClient
};
