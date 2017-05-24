'use strict';

const winston = require('winston');

// Custom config to gain timestamp
// taken from https://github.com/winstonjs/winston
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return Date.now();
      },
      formatter: function(options) {
        // Return string will be passed to logger.
        return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
});

logger.level = process.env.LOG_LEVEL || 'info';

module.exports = logger;