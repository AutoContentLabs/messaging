// src/utils/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs').promises;

const logFilePath = path.resolve('logs/messaging.log');

const ensureLogDirectoryExists = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Log directory creation failed: ${error.message}`);
  }
};
ensureLogDirectoryExists(path.dirname(logFilePath));


const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return stack
        ? `${timestamp} [${level}]: ${message} - ${stack}`
        : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: logFilePath,
      maxsize: 5242880,
      maxFiles: 5,
      format: winston.format.json(),
    }),
  ],
});


module.exports = logger;
