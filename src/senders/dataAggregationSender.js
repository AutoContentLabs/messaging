/**
 * src\senders\dataAggregationSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
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
        logger.crit(`[DataAggregationSender] [sendDataAggregation] [crit] Invalid arguments passed for jobId: ${jobId}, taskId: ${taskId}`);
        throw new Error('Invalid arguments');
    }

    logger.debug(`[DataAggregationSender] [sendDataAggregation] [debug] Starting data aggregation for jobId: ${jobId}, taskId: ${taskId}`);

    // parameters
    const key = `dataAggregation-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                aggregatedData, // Example: { 'AI in healthcare': 35000, 'Quantum Computing': 24000 }
                status: 'aggregated',
                message: 'Data aggregation completed.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        await sendMessage(topics.dataAggregation, pairs);
        logger.info(`[DataAggregationSender] [sendDataAggregation] [info] Data aggregation completed successfully for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        logger.error(`[DataAggregationSender] [sendDataAggregation] [error] Failed to send data aggregation message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;
    }
}

module.exports = { sendDataAggregation };
