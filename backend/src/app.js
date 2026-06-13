const express = require('express');
const cors = require('cors');
const mainRoutes = require('./routes'); // Assuming index.js is in routes/
// Import other middleware if needed later

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Load environment variables
require('dotenv').config({ path: '../.env' }); // Adjust path if needed

// Main Routes
app.use('/api', mainRoutes);

// Basic route for health check or root
app.get('/', (req, res) => {
  res.send('UMKM Connect WA Backend is running!');
});

// Error handling middleware (optional, for later)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


module.exports = app;
