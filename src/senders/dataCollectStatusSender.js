// src/senders/dataCollectStatusSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a status update for a data collection task.
 * @param {string} taskId - Unique identifier for the data collection task.
 * @param {string} status - The current status of the data collection task.
 * @param {string} messageText - The message detailing the current status.
 * @returns {Promise<void>}
 */
async function sendDataCollectStatus(taskId, status, messageText) {
    if (typeof taskId !== 'string' || typeof status !== 'string' || typeof messageText !== 'string') {
        logger.error('Invalid arguments passed to sendDataCollectStatus');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dataCollectStatus-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            status,
            message: messageText
        }))
    };

    try {
        await sendMessage(topics.dataCollectStatus, [message]);
        logger.info(`Data collect status sent for taskId: ${taskId} with status: ${status}`);
    } catch (error) {
        logger.error(`Failed to send data collect status for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendDataCollectStatus };
