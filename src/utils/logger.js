/**
 * src/utils/logger.js
 * alert (Alert): Non-critical situations that require immediate intervention. For example, a major service outage or an unexpected situation.
 * https://datatracker.ietf.org/doc/html/rfc5424
 * crit (Critical): Serious problems with system components, but the entire system has not crashed. For example, a database connection loss or a critical component failure.
 * error (Error): Error occurrence. Although the process can continue, logging of erroneous situations is necessary. For example, user errors or database errors.
 * warning (Warning): There is a potential problem, but immediate intervention is not required. For example, memory usage, disk space shortage.
 * notice (Notice): Situations that are normal in the system but that users should be aware of. New updates or release notes.
 * info (Info): Used to follow the normal process flow in the system. A process or task that has been successfully completed.
 * debug (Debug): Detailed logs used for development and debugging purposes. Information such as variable values ​​and method calls within the process.
 */

const config = require("../transporters/config");
const winston = require('winston');
const path = require('path');
const fs = require('fs').promises;

// Detect if the application is running inside Docker
const isDocker = fs.existsSync('/.dockerenv') || fs.existsSync('/proc/1/cgroup');

// Define log file path
const logFilePath = path.resolve('logs/messaging.log');

// Ensure log directory exists
const ensureLogDirectoryExists = async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error(`Log directory creation failed: ${error.message}`);
  }
};
ensureLogDirectoryExists(path.dirname(logFilePath));

// Custom log levels and formatting
const customLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  colors: {
    emerg: 'red',
    alert: 'magenta',
    crit: 'yellow',
    error: 'red',
    warning: 'yellow',
    notice: 'blue',
    info: 'green',
    debug: 'cyan',
  },
  icons: {
    emerg: '🔥',
    alert: '⚠️ ',
    crit: '🚨',
    error: '❌',
    warning: '🔶',
    notice: '🔔',
    info: 'ℹ️ ',
    debug: '🐞',
  }
};

// Logger creation
const logger = winston.createLogger({
  level: config.APP_LOG_LEVEL || "info",
  levels: customLevels.levels,
  format: winston.format.combine(
    // Conditionally add the timestamp based on the environment
    ...(isDocker ? [] : [winston.format.timestamp()]), // No timestamp if inside Docker
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
      const icon = customLevels.icons[level] || '';
      let logMessage = '';

      // Include timestamp unless in Docker
      if (!isDocker && timestamp) {
        logMessage += `${timestamp} `;
      }

      logMessage += `${icon} [${level}] ${message}`;

      if (stack) {
        logMessage += ` - ${stack}`;
      }

      if (Object.keys(metadata).length) {
        logMessage += ` ${JSON.stringify(metadata)}`;
      }

      return logMessage;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf((data) => {
          const { timestamp, level, message } = data;
          const icon = customLevels.icons[level] || '';
          let logMessage = '';

          // Include timestamp unless in Docker
          if (!isDocker && timestamp) {
            logMessage += `${timestamp} `;
          }

          return `${logMessage}${icon} [${level}] ${message}`;
        })
      ),
    }),

    new winston.transports.File({
      filename: logFilePath,
      maxsize: 5242880,
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(({ timestamp, level, message, ...metadata }) => {
          const logData = {
            timestamp,
            level,
            message,
            ...metadata,
          };

          return JSON.stringify(logData);
        })
      ),
    }),
  ],
});

module.exports = logger;
