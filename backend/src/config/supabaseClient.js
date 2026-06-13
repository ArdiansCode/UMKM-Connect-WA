import { createClient } from '@supabase/supabase-js';
import config from './index.js'; // Import from index.js explicitly
import logger from '../utils/logger.js';

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

// Export the client for use in services
export { getSupabaseClient as getClient };
