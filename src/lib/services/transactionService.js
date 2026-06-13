import { getClient } from "../config/supabaseClient";
import logger from "../utils/logger";

const supabase = getClient();

const addTransaction = async ({ userId, type, amount, description, source, date }) => {
  logger.info(`Adding transaction for user ${userId}, type: ${type}, amount: ${amount}`);
  try {
    const { data, error } = await supabase
      .from('transactions') // Assuming your table is named 'transactions'
      .insert([
        {
          user_id: userId, // Foreign key to users table
          type: type,      // 'income' or 'expense'
          amount: amount,
          description: description || null, // Allow null if no description
          source: source || null,           // For income, where it came from
          date: date ? new Date(date).toISOString() : new Date().toISOString(), // Transaction date, default to now
        },
      ])
      .select(); // Get the inserted row
    
    if (error) throw error;
    logger.info("Transaction added in Supabase:", data ? data[0] : 'no data');
    return data ? data[0] : null;
  } catch (error) {
    logger.error("Error adding transaction:", error.message);
    throw error;
  }
};

// Function to get transactions, supporting filtering by period
const getTransactions = async (userId, period = 'month') => {
  logger.info(`Fetching transactions for user ${userId}, period: ${period}`);
  try {
    const now = new Date();
    let startDate = new Date();
    
    // Define date range based on 'period'
    if (period === 'hari ini') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'minggu ini') {
      // Adjust to start of the week (Sunday is 0, Monday is 1, etc.)
      // Assuming week starts on Sunday for simplicity of JS getDay()
      startDate.setDate(now.getDate() - now.getDay()); 
      startDate.setHours(0, 0, 0, 0);
    } else { // Default to 'bulan ini'
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    logger.info(`Fetching transactions from ${startDate.toISOString()} to ${now.toISOString()}`);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString())
      .lte('date', now.toISOString())
      .order('date', { ascending: true }); // Order by date
    
    if (error) throw error;
    logger.info(`Fetched ${data ? data.length : 0} transactions.`);
    return data || [];
  } catch (error) {
    logger.error("Error fetching transactions:", error.message);
    throw error;
  }
};

export default {
  addTransaction,
  getTransactions,
};
