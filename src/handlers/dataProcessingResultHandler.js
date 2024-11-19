
/**
 * dataProcessingResult handler
 * src/handlers/dataProcessingResultHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingResult messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataProcessingResultRequest(model) {
  try {
    logger.debug(`[dataProcessingResultHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { taskId, result, timestamp } = handleMessageData;
      
    logger.info(`[handleDataProcessingResult] Processed request successfully: ${taskId}, ${result}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataProcessingResultHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingResultRequest };
