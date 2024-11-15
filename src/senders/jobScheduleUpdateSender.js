/**
 * src\senders\jobScheduleUpdateSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("./messageSender");
const logger = require('../utils/logger');

/**
 * Sends a message to update the schedule of a job.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} schedule - The updated schedule for the job.
 * @returns {Promise<void>}
 */
async function sendJobScheduleUpdate(jobId, taskId, schedule) {
    // Validate parameters
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof schedule !== 'object') {
        logger.error('[JobScheduleSender] [sendJobScheduleUpdate] [error] Invalid arguments passed to sendJobScheduleUpdate');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `jobScheduleUpdate-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                schedule,
                status: 'updated',
                message: 'Job schedule updated.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];
    try {
        await sendMessage(topics.jobScheduleUpdate, pairs);
        logger.info(`[JobScheduleSender] [sendJobScheduleUpdate] [success] Job schedule update message sent for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[JobScheduleSender] [sendJobScheduleUpdate] [error] Failed to send job schedule update message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendJobScheduleUpdate };
