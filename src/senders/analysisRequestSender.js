// src/senders/analysisRequestSender.js
const { sendMessage, topics } = require('../messageService');
const logger = require('../utils/logger');

/**
 * Sends a request to analyze trends with specified parameters.
 * @param {string} taskId - The task's unique identifier.
 * @param {string} analysisType - The type of analysis (e.g., "trend", "sentiment").
 * @param {object} parameters - Parameters specific to the analysis request (e.g., { region: 'US', category: 'Technology' }).
 * @returns {Promise<void>}
 */
async function sendAnalysisRequest(taskId, analysisType, parameters) {
    // Validate inputs
    if (typeof taskId !== 'string' || typeof analysisType !== 'string' || typeof parameters !== 'object') {
        logger.error('Invalid arguments passed to sendAnalysisRequest');
        throw new Error('Invalid arguments');
    }

    const message = {
        key: `analysisRequest-${taskId}`,
        value: Buffer.from(JSON.stringify({
            timestamp: new Date().toISOString(),
            taskId,
            analysisType,
            parameters, // Example: { region: 'US', category: 'Technology' }
            status: 'pending',
            message: 'Requesting analysis for trends.'
        }))
    };

    try {
        // Send the analysis request message to the analysisRequest topic
        await sendMessage(topics.analysisRequest, [message]);
        logger.info(`Analysis request sent for taskId: ${taskId} with analysis type: ${analysisType}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`Failed to send analysis request for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendAnalysisRequest };
