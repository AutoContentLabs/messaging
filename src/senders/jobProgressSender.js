/**
 * src\senders\jobProgressSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends a message indicating the progress of a job.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {number} progress - The current progress of the job (e.g., 65 for 65%).
 * @param {string} message - A message providing additional context about the job's progress.
 * @returns {Promise<void>}
 */
async function sendJobProgress(jobId, taskId, progress, message) {
    // Validate parameters
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof progress !== 'number' || typeof message !== 'string') {
        logger.error('[JobProgressSender] [sendJobProgress] [error] Invalid arguments passed to sendJobProgress');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `jobProgress-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                progress, // e.g., 65 for 65%
                message
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.jobProgress, pairs);
        logger.info(`[JobProgressSender] [sendJobProgress] [success] Job progress message sent for jobId: ${jobId}, taskId: ${taskId}, progress: ${progress}%`);
    } catch (error) {
        logger.error(`[JobProgressSender] [sendJobProgress] [error] Failed to send job progress message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendJobProgress };
