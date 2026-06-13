import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger';

let supabaseClient = null;

function getClient() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      logger.error("Supabase URL or Anon Key not configured. Please check environment variables.");
      throw new Error("Supabase is not configured.");
    }
    supabaseClient = createClient(url, anonKey);
    logger.info("Supabase client initialized.");
  }
  return supabaseClient;
}

export { getClient };
