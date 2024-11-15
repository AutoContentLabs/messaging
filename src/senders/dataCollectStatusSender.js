/**
 * src\senders\dataCollectStatusSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
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
        logger.error('[DataCollectStatusSender] [sendDataCollectStatus] [error] Invalid arguments passed to sendDataCollectStatus');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `dataCollectStatus-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                status,
                message: messageText
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataCollectStatus, pairs);
        logger.info(`[DataCollectStatusSender] [sendDataCollectStatus] [success] Data collect status sent successfully for taskId: ${taskId} with status: ${status}`);
    } catch (error) {
        logger.error(`[DataCollectStatusSender] [sendDataCollectStatus] [error] Failed to send data collect status for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendDataCollectStatus };
