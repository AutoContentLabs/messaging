// src/senders/dataCollectResponseSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a data collection response message to the specified topic.
 * @param {string} taskId - Unique identifier for the data collection task.
 * @param {object} data - The collected data.
 * @returns {Promise<void>}
 */
async function sendDataCollectResponse(taskId, data) {
    if (typeof taskId !== 'string' || typeof data !== 'object') {
        logger.error('Invalid arguments passed to sendDataCollectResponse');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dataCollectResponse-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            status: 'completed',
            data,
            message: 'Data collection completed successfully.'
        }))
    };

    try {
        await sendMessage(topics.dataCollectResponse, [message]);
        logger.info(`Data collect response sent for taskId: ${taskId}`);
    } catch (error) {
        logger.error(`Failed to send data collect response for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw error to handle it upstream if needed
    }
}

module.exports = { sendDataCollectResponse };
