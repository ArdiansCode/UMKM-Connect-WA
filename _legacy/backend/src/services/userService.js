const { getClient } = require('../config/supabaseClient');
const logger = require('../utils/logger');

const supabase = getClient();

const getUserByWhatsAppNumber = async (whatsappNumber) => {
  // Jangan potong nomor, gunakan nomor lengkap yang masuk
  const cleanNumber = whatsappNumber.replace(/\D/g, ''); 

  logger.info(`Fetching user by WhatsApp number: ${whatsappNumber} (Clean: ${cleanNumber})`);
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      // Mencari kecocokan eksak atau setidaknya mengandung angka tersebut
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
      .select(); // get the inserted row
    
    if (error) throw error;
    logger.info("User created in Supabase:", data ? data[0] : 'no data');
    return data ? data[0] : null;
  } catch (error) {
    logger.error("Error creating user:", error.message);
    throw error;
  }
};

// Placeholder for other user-related functions
// async getUserById(userId) { ... }

module.exports = {
  getUserByWhatsAppNumber,
  createUser,
};
