import { getClient } from '../config/supabaseClient';
import logger from '../utils/logger';

function getSupabase() {
  return getClient();
}

const getUserByWhatsAppNumber = async (whatsappNumber) => {
  const supabase = getSupabase();
  const cleanNumber = whatsappNumber.replace(/\D/g, ''); 

  logger.info(`Fetching user by WhatsApp number: ${whatsappNumber} (Clean: ${cleanNumber})`);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`whatsapp_number.eq.${cleanNumber},whatsapp_number.eq.0${cleanNumber},whatsapp_number.eq.+${cleanNumber}`)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    logger.error("Error fetching user:", error.message);
    throw error;
  }
};

const createUser = async ({ name, whatsappNumber, businessName, businessType }) => {
  const supabase = getSupabase();
  logger.info(`Creating new user: ${whatsappNumber}`);
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name,
          whatsapp_number: whatsappNumber,
          business_name: businessName,
          business_type: businessType,
          created_at: new Date().toISOString(),
        },
      ])
      .select();
    
    if (error) throw error;
    logger.info("User created in Supabase:", data ? data[0] : 'no data');
    return data ? data[0] : null;
  } catch (error) {
    logger.error("Error creating user:", error.message);
    throw error;
  }
};

export default {
  getUserByWhatsAppNumber,
  createUser,
};
