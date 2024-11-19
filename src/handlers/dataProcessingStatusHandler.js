
/**
 * dataProcessingStatus handler
 * src/handlers/dataProcessingStatusHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingStatus messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataProcessingStatusRequest(model) {
  try {
    logger.debug(`[dataProcessingStatusHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { taskId, status, timestamp } = handleMessageData;
      
    logger.info(`[handleDataProcessingStatus] Processed request successfully: ${taskId}, ${status}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataProcessingStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingStatusRequest };
