
/**
 * dataCollectError handler
 * src/handlers/dataCollectErrorHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectError messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataCollectErrorRequest(model) {
  try {
    logger.debug(`[dataCollectErrorHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { id, errorCode, errorMessage, timestamp } = handleMessageData;
      
    logger.info(`[handleDataCollectError] Processed request successfully: ${id}, ${errorCode}, ${errorMessage}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataCollectErrorHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectErrorRequest };
