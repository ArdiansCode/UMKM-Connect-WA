const app = require('./backend/src/app');
const config = require('./backend/src/config');
const logger = require('./backend/src/utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});
