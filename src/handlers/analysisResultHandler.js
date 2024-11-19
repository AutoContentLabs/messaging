
/**
 * analysisResult handler
 * src/handlers/analysisResultHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisResult messages.
 * @param {Object} model - The incoming model.
 */
async function handleAnalysisResultRequest(model) {
  try {
    logger.debug(`[analysisResultHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { analysisId, resultData, timestamp } = handleMessageData;
      
    logger.info(`[handleAnalysisResult] Processed request successfully: ${analysisId}, ${resultData}, ${timestamp}`);
  } catch (error) {
    logger.error(`[analysisResultHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisResultRequest };
