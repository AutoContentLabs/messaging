// src/senders/dataAggregationSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a data aggregation completion message.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} aggregatedData - The aggregated data to be sent (e.g., { 'AI in healthcare': 35000, 'Quantum Computing': 24000 }).
 * @returns {Promise<void>}
 */
async function sendDataAggregation(jobId, taskId, aggregatedData) {
    // Validate inputs
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof aggregatedData !== 'object') {
        logger.error('Invalid arguments passed to sendDataAggregation');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `dataAggregation-${jobId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            jobId,
            taskId,
            aggregatedData, // Example: { 'AI in healthcare': 35000, 'Quantum Computing': 24000 }
            status: 'aggregated',
            message: 'Data aggregation completed.'
        }))
    };

    try {
        // Send the data aggregation message to the dataAggregation topic
        await sendMessage(topics.dataAggregation, [message]);
        logger.info(`Data aggregation completed successfully for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send data aggregation message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendDataAggregation };
