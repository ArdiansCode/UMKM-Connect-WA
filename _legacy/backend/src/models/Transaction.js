// src/models/Transaction.js
// Conceptual representation of the Transaction model.
// Define schema in Supabase or your database.

/*
Example Transaction schema:

{
  id: 'transaction_uuid_string', // Primary key
  created_at: 'timestamp',
  userId: 'string', // Foreign key linking to the User
  type: 'enum: "income" | "expense"', // Type of transaction
  amount: 'number', // The amount of the transaction
  description: 'string', // Description of the transaction (e.g., 'Beli bahan baku', 'Penjualan Baju')
  source: 'string | null', // For income: e.g., 'Penjualan dari Toko A', 'Customer X'
  date: 'timestamp', // Date and time of the transaction
  // category: 'string', // Optional: for more detailed categorization
}
*/

module.exports = {};
