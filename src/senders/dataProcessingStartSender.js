/**
 * src\senders\dataProcessingStartSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("./messageSender");
const logger = require('../utils/logger');

/**
 * Sends a message indicating the start of data processing.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @returns {Promise<void>}
 */
async function sendDataProcessingStart(jobId, taskId) {
    if (typeof jobId !== 'string' || typeof taskId !== 'string') {
        logger.error('[DataProcessingSender] [sendDataProcessingStart] [error] Invalid jobId or taskId in sendDataProcessingStart');
        throw new Error('Invalid jobId or taskId');
    }

    // parameters
    const key = `dataProcessingStart-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                status: 'started',
                message: 'Data processing started for trend data.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataProcessingStart, pairs);
        logger.info(`[DataProcessingSender] [sendDataProcessingStart] [success] Data processing started for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DataProcessingSender] [sendDataProcessingStart] [error] Failed to send start message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataProcessingStart };
