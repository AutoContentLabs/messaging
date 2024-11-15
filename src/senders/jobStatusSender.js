/**
 * src\senders\jobStatusSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends a job status update message.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} status - The status of the job (e.g., 'started', 'completed', 'failed').
 * @param {string} message - Additional message regarding the job status.
 * @returns {Promise<void>}
 */
async function sendJobStatus(jobId, taskId, status, message) {
    // Validate parameters
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof status !== 'string' || typeof message !== 'string') {
        logger.error('[JobStatusSender] [sendJobStatus] [error] Invalid arguments passed to sendJobStatus');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `jobStatus-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                status,
                message
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.jobStatus, pairs);
        logger.info(`[JobStatusSender] [sendJobStatus] [success] Job status message sent for jobId: ${jobId}, taskId: ${taskId}, status: ${status}`);
    } catch (error) {
        logger.error(`[JobStatusSender] [sendJobStatus] [error] Failed to send job status message for jobId: ${jobId}, taskId: ${taskId}, status: ${status}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendJobStatus };
