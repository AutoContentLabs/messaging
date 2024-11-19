
/**
 * dataCollectStatus handler
 * src/handlers/dataCollectStatusHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectStatus messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataCollectStatusRequest(model) {
  try {
    logger.debug(`[dataCollectStatusHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { id, status, message, timestamp } = handleMessageData;
      
    logger.info(`[handleDataCollectStatus] Processed request successfully: ${id}, ${status}, ${message}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataCollectStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectStatusRequest };
