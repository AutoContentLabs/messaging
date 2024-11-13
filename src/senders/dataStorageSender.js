// src/senders/dataStorageSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a message indicating that data has been successfully stored.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} data - The data to be stored, e.g., { trend: 'AI in healthcare', mentions: 15000 }.
 * @returns {Promise<void>}
 */
async function sendDataStorage(jobId, taskId, data) {
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof data !== 'object') {
        logger.error('Invalid arguments passed to sendDataStorage');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dataStorage-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            data, // Example: { trend: 'AI in healthcare', mentions: 15000 }
            status: 'stored',
            message: 'Data stored successfully.'
        }))
    };

    try {
        await sendMessage(topics.dataStorage, [message]);
        logger.info(`Data storage message sent for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`Failed to send data storage message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataStorage };
