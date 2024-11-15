// src/senders/jobScheduleSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a message to schedule the creation of a job.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} schedule - The schedule for the job (e.g., { startTime: '2024-11-13T00:00:00Z' }).
 * @returns {Promise<void>}
 */
async function sendJobScheduleCreate(jobId, taskId, schedule) {
    // Validate parameters
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof schedule !== 'object') {
        logger.error('[JobScheduleSender] [sendJobScheduleCreate] [error] Invalid arguments passed to sendJobScheduleCreate');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `jobScheduleCreate-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            jobType: 'dataProcessing',
            schedule,
            status: 'scheduled',
            message: 'Job scheduled to start processing collected data.'
        }))
    };

    try {
        await sendMessage(topics.jobScheduleCreate, [message]);
        logger.info(`[JobScheduleSender] [sendJobScheduleCreate] [success] Job schedule creation message sent for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[JobScheduleSender] [sendJobScheduleCreate] [error] Failed to send job schedule creation message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

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

    const message = {
        key: `jobScheduleUpdate-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            schedule,
            status: 'updated',
            message: 'Job schedule updated.'
        }))
    };

    try {
        await sendMessage(topics.jobScheduleUpdate, [message]);
        logger.info(`[JobScheduleSender] [sendJobScheduleUpdate] [success] Job schedule update message sent for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[JobScheduleSender] [sendJobScheduleUpdate] [error] Failed to send job schedule update message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendJobScheduleCreate, sendJobScheduleUpdate };
