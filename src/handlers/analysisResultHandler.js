
/**
 * analysisResult handler
 * src/handlers/analysisResultHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming analysisResult messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleAnalysisResultRequest(pair) {
  try {
    logger.debug(`[analysisResultHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { analysisId, resultData, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleAnalysisResult] Processed request successfully: ${analysisId}, ${resultData}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[analysisResultHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAnalysisResultRequest };
