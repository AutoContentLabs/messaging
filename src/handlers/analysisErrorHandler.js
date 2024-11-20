
/**
 * analysisError handler
 * src/handlers/analysisErrorHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisError messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleAnalysisErrorRequest(pair) {
  try {
    logger.debug(`[analysisErrorHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { analysisId, errorCode, errorMessage, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleAnalysisError] Processed request successfully: ${analysisId}, ${errorCode}, ${errorMessage}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[analysisErrorHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisErrorRequest };
