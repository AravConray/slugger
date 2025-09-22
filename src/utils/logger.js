'use strict';
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;

const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || (env === 'development' ? 'debug' : 'info');

const consoleFormat = env === 'development'
  ? combine(
      colorize(),
      timestamp(),
      printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
    )
  : combine(
      timestamp(),
      json()
    );

const logger = createLogger({
  level: logLevel,
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: consoleFormat,
      level: logLevel,
    })
  ],
  exitOnError: false,
});

if (env !== 'development') {
  logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new transports.File({ filename: 'logs/combined.log' }));
}

// Stream interface for HTTP request logging (e.g., morgan)
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
