/**
 * src\senders\logSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
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
        logger.error('[LogSender] [sendLog] [error] Invalid arguments passed to sendLog');
        throw new Error('Invalid arguments');
    }

    // Validate log level
    const validLogLevels = ['info', 'warn', 'error', 'debug', 'critical'];
    if (!validLogLevels.includes(logLevel)) {
        logger.error(`[LogSender] [sendLog] [error] Invalid log level: ${logLevel} passed to sendLog`);
        throw new Error(`Invalid log level: ${logLevel}`);
    }

    // parameters
    const key = `log-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(), // ISO string format
                logLevel,
                taskId,
                message: messageText
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        // Attempt to send the log message to Kafka
        await sendMessage(topics.logs, pairs);
        logger.info(`[LogSender] [sendLog] [success] Log sent for taskId: ${taskId} with log level: ${logLevel}`);
    } catch (error) {
        // Log the error and rethrow to propagate
        logger.error(`[LogSender] [sendLog] [error] Failed to send log for taskId: ${taskId}. Error: ${error.message}`);
        // Optional: Retry logic or additional error handling can be added here
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendLog };
