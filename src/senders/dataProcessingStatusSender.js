/**
 * src\senders\dataProcessingStatusSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("./messageSender");
const logger = require('../utils/logger');

/**
 * Sends a message with the current status of data processing.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} status - The current status of data processing (e.g., 'in progress').
 * @param {string} statusMessage - A message describing the status.
 * @returns {Promise<void>}
 */
async function sendDataProcessingStatus(jobId, taskId, status, statusMessage) {
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof status !== 'string' || typeof statusMessage !== 'string') {
        logger.error('[DataProcessingSender] [sendDataProcessingStatus] [error] Invalid arguments passed to sendDataProcessingStatus');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `dataProcessingStatus-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                status,
                message: statusMessage
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataProcessingStatus, pairs);
        logger.info(`[DataProcessingSender] [sendDataProcessingStatus] [success] Data processing status updated for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DataProcessingSender] [sendDataProcessingStatus] [error] Failed to send status message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataProcessingStatus };
