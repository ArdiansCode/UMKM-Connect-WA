const app = require('./backend/src/app');
const config = require('./backend/src/config');
const logger = require('./backend/src/utils/logger');

// Jika dijalankan di Vercel, cukup ekspor app-nya saja
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Jika di lokal (Node.js biasa), tetap gunakan app.listen
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    logger.info(`Server running on port ${PORT}`);
  });
}
