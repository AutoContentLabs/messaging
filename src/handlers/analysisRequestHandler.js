
/**
 * analysisRequest handler
 * src/handlers/analysisRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisRequest messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleAnalysisRequestRequest(pair) {
  try {
    logger.debug(`[analysisRequestHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { analysisId, requestData, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleAnalysisRequest] Processed request successfully: ${analysisId}, ${requestData}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[analysisRequestHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisRequestRequest };
