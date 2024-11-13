// src/senders/logSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a log message related to a task.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} logLevel - The severity level of the log (e.g., 'info', 'error').
 * @param {string} messageText - The content of the log message.
 * @returns {Promise<void>}
 */
async function sendLog(taskId, logLevel, messageText) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof logLevel !== 'string' || typeof messageText !== 'string') {
        logger.error('Invalid arguments passed to sendLog');
        throw new Error('Invalid arguments');
    }

    // Validate log level
    const validLogLevels = ['info', 'warn', 'error', 'debug', 'critical'];
    if (!validLogLevels.includes(logLevel)) {
        logger.error(`Invalid log level: ${logLevel} passed to sendLog`);
        throw new Error(`Invalid log level: ${logLevel}`);
    }

    // Prepare message object
    const message = {
        key: `log-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(), // ISO string format
            logLevel,
            taskId,
            message: messageText
        }))
    };

    try {
        // Attempt to send the log message to Kafka
        await sendMessage(topics.logs, [message]);
        logger.info(`Log sent for taskId: ${taskId} with log level: ${logLevel}`);
    } catch (error) {
        // Log the error and rethrow to propagate
        logger.error(`Failed to send log for taskId: ${taskId}. Error: ${error.message}`);
        // Optional: Retry logic or additional error handling can be added here
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendLog };
