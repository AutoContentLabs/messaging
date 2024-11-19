
/**
 * analysisRequest handler
 * src/handlers/analysisRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisRequest messages.
 * @param {Object} model - The incoming model.
 */
async function handleAnalysisRequestRequest(model) {
  try {
    logger.debug(`[analysisRequestHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { analysisId, requestData, timestamp } = handleMessageData;
      
    logger.info(`[handleAnalysisRequest] Processed request successfully: ${analysisId}, ${requestData}, ${timestamp}`);
  } catch (error) {
    logger.error(`[analysisRequestHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisRequestRequest };
