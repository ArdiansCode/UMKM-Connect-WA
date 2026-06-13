const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        // You can add file appenders here for production logging
        // file: { type: 'file', filename: 'logs/app.log' }
    },
    categories: {
        default: { appenders: ['console'], level: 'info' },
        // You can create specific categories for different parts of your app
        // http: { appenders: ['console'], level: 'warn' }
    }
});

const logger = log4js.getLogger();

module.exports = logger;
