// src/senders/dataProcessingSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a message indicating the start of data processing.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @returns {Promise<void>}
 */
async function sendDataProcessingStart(jobId, taskId) {
    if (typeof jobId !== 'string' || typeof taskId !== 'string') {
        logger.error('Invalid jobId or taskId in sendDataProcessingStart');
        throw new Error('Invalid jobId or taskId');
    }

    const startMessage = {
        key: `dataProcessingStart-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            status: 'started',
            message: 'Data processing started for trend data.'
        }))
    };

    try {
        await sendMessage(topics.dataProcessingStart, [startMessage]);
        logger.info(`Data processing started for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`Failed to send start message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

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
        logger.error('Invalid arguments passed to sendDataProcessingStatus');
        throw new Error('Invalid arguments');
    }

    const statusMessageData = {
        key: `dataProcessingStatus-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            status,
            message: statusMessage
        }))
    };

    try {
        await sendMessage(topics.dataProcessingStatus, [statusMessageData]);
        logger.info(`Data processing status updated for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`Failed to send status message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

/**
 * Sends the result of data processing.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} result - The result of the data processing (e.g., trends).
 * @returns {Promise<void>}
 */
async function sendDataProcessingResult(jobId, taskId, result) {
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof result !== 'object') {
        logger.error('Invalid arguments passed to sendDataProcessingResult');
        throw new Error('Invalid arguments');
    }

    const resultMessage = {
        key: `dataProcessingResult-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            result, // Example: { trends: [{ trend: 'AI', score: 85 }] }
            status: 'completed',
            message: 'Data processing completed.'
        }))
    };

    try {
        await sendMessage(topics.dataProcessingResult, [resultMessage]);
        logger.info(`Data processing completed for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`Failed to send result message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataProcessingStart, sendDataProcessingStatus, sendDataProcessingResult };
