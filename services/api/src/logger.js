const winston = require('winston');

const {
  LOG_FILE,
  LOG_FILE_LEVEL,
  LOG_CONSOLE_LEVEL,
} = process.env;

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      level: LOG_FILE_LEVEL,
      // prepend logfile name with a timestamp so that you can easily spot
      // which logfile came before which other logfile
      filename: LOG_FILE,
      timestamp: true,
    }),
    new (winston.transports.Console)({
      level: LOG_CONSOLE_LEVEL,
      timestamp: true,
    }),
  ],
});

module.exports = logger;
