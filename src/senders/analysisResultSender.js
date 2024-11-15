/**
 * src\senders\analysisResultSender.js
 */

const { topics } = require("../topics")
const { sendMessage } = require("../senders/messageSender");
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
        logger.alert(`[AnalysisResultSender] [sendAnalysisResult] [alert] Invalid arguments for taskId: ${taskId}`);
        throw new Error('Invalid arguments');
    }

    // parameters
    const key = `analysisResult-${taskId}`
    const value = Buffer.from(
        JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                taskId,
                analysisType,
                result, // Example: { 'AI in healthcare': 85, 'Quantum Computing': 78 }
                status: 'completed',
                message: 'Analysis completed successfully.'
            }
        )
    )

    const pairs = [
        { key, value }
    ];

    try {
        // Send the analysis result message to the analysisResult topic
        await sendMessage(topics.analysisResult, pairs);
        logger.info(`[AnalysisResultSender] [sendAnalysisResult] [info] Analysis result sent successfully for taskId: ${taskId} with analysis type: ${analysisType}`);
    } catch (error) {
        // Log error if message sending fails
        logger.error(`[AnalysisResultSender] [sendAnalysisResult] [error] Failed to send analysis result for taskId: ${taskId}. Error: ${error.message}`);
        throw error;  // Re-throw the error to be handled upstream if needed
    }
}

module.exports = { sendAnalysisResult };
