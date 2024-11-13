// src/senders/analysisResultSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends the result of an analysis once it is completed.
 * @param {string} taskId - The unique identifier for the task.
 * @param {string} analysisType - The type of analysis (e.g., "trend", "sentiment").
 * @param {object} result - The result of the analysis (e.g., { 'AI in healthcare': 85, 'Quantum Computing': 78 }).
 * @returns {Promise<void>}
 */
async function sendAnalysisResult(taskId, analysisType, result) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof analysisType !== 'string' || typeof result !== 'object') {
        logger.error('Invalid arguments passed to sendAnalysisResult');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `analysisResult-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            analysisType,
            result, // Example: { 'AI in healthcare': 85, 'Quantum Computing': 78 }
            status: 'completed',
            message: 'Analysis completed successfully.'
        }))
    };

    try {
        // Send the analysis result message to the analysisResult topic
        await sendMessage(topics.analysisResult, [message]);
        logger.info(`Analysis result sent for taskId: ${taskId} with analysis type: ${analysisType}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send analysis result for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendAnalysisResult };
