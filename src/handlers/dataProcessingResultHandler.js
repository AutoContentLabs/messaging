
/**
 * dataProcessingResult handler
 * src/handlers/dataProcessingResultHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingResult messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataProcessingResultRequest(pair) {
  try {
    logger.debug(`[dataProcessingResultHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { taskId, result, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataProcessingResult] Processed request successfully: ${taskId}, ${result}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataProcessingResultHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingResultRequest };
