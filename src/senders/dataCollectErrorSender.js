// src/senders/dataCollectErrorSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends an error message related to a data collection task.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} errorCode - A unique error code.
 * @param {string} errorMessage - A detailed error message.
 * @returns {Promise<void>}
 */
async function sendDataCollectError(taskId, errorCode, errorMessage) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof errorCode !== 'string' || typeof errorMessage !== 'string') {
        logger.error('Invalid arguments passed to sendDataCollectError');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dataCollectError-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            errorCode,
            message: errorMessage
        }))
    };

    try {
        // Send the error message to the error topic
        await sendMessage(topics.dataCollectError, [message]);
        logger.info(`Error message sent for taskId: ${taskId} with error code: ${errorCode}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send error message for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendDataCollectError };
