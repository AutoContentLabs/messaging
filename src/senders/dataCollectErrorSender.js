/**
 * src\senders\dataCollectErrorSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
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
        logger.crit(`[DataCollectErrorSender] [sendDataCollectError] [crit] Invalid arguments passed for taskId: ${taskId}, errorCode: ${errorCode}`);
        throw new Error('Invalid arguments');
    }

    logger.debug(`[DataCollectErrorSender] [sendDataCollectError] [debug] Starting to send error message for taskId: ${taskId}, errorCode: ${errorCode}`);

    // parameters
    const key = `dataCollectError-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                errorCode,
                message: errorMessage
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataCollectError, pairs);
        logger.info(`[DataCollectErrorSender] [sendDataCollectError] [info] Error message sent successfully for taskId: ${taskId} with error code: ${errorCode}`);
    } catch (error) {
        logger.error(`[DataCollectErrorSender] [sendDataCollectError] [error] Failed to send error message for taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataCollectError };
