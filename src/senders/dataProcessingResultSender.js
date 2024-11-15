/**
 * src\senders\dataProcessingResultSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
const logger = require('../utils/logger');

/**
 * Sends a data processing result message.
 * @param {string} jobId - The unique identifier for the job.
 * @param {string} taskId - The unique identifier for the task.
 * @param {object} result - The result of the data processing (e.g., insights or summary).
 * @returns {Promise<void>}
 */
async function sendDataProcessingResult(jobId, taskId, result) {
    // Validate inputs
    if (typeof jobId !== 'string' || typeof taskId !== 'string' || typeof result !== 'object') {
        logger.error('[DataProcessingResultSender] [sendDataProcessingResult] [error] Invalid arguments passed to sendDataProcessingResult');
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `dataProcessingResult-${jobId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                jobId,
                taskId,
                result, // Example: { 'AI in healthcare': 85, 'Quantum Computing': 78 }
                status: 'completed',
                message: 'Data processing completed. Insights generated.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        // Send the data processing result message to the dataProcessingResult topic
        await sendMessage(topics.dataProcessingResult, pairs);
        logger.info(`[DataProcessingResultSender] [sendDataProcessingResult] [success] Data processing completed successfully for jobId: ${jobId}, taskId: ${taskId}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`[DataProcessingResultSender] [sendDataProcessingResult] [error] Failed to send data processing result message for jobId: ${jobId}, taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendDataProcessingResult };
