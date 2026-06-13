const express = require('express');
const cors = require('cors');
const mainRoutes = require('./routes'); // Assuming index.js is in routes/
// Import other middleware if needed later

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet()); // Set various HTTP headers for security

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Terlalu banyak permintaan dari IP ini, coba lagi nanti.'
});
app.use('/api/', limiter); // Apply to all API requests

// Middleware
app.use(cors()); // Sebaiknya batasi origin jika sudah tahu domain frontend-nya
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Load environment variables
// Vercel handles env vars via dashboard, so don't try to load .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: '../.env' });
}

// Main Routes
app.use('/api', mainRoutes);

// Serve static files from frontend build directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Catch-all route to serve React app for any undefined routes (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});

// Error handling middleware (optional, for later)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });


module.exports = app;
