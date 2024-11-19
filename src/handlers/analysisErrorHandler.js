
/**
 * analysisError handler
 * src/handlers/analysisErrorHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisError messages.
 * @param {Object} model - The incoming model.
 */
async function handleAnalysisErrorRequest(model) {
  try {
    logger.debug(`[analysisErrorHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { analysisId, errorCode, errorMessage, timestamp } = handleMessageData;
      
    logger.info(`[handleAnalysisError] Processed request successfully: ${analysisId}, ${errorCode}, ${errorMessage}, ${timestamp}`);
  } catch (error) {
    logger.error(`[analysisErrorHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisErrorRequest };
