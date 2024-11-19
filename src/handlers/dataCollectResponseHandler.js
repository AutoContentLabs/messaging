
/**
 * dataCollectResponse handler
 * src/handlers/dataCollectResponseHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectResponse messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataCollectResponseRequest(model) {
  try {
    logger.debug(`[dataCollectResponseHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { id, data, timestamp } = handleMessageData;
      
    logger.info(`[handleDataCollectResponse] Processed request successfully: ${id}, ${data}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataCollectResponseHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectResponseRequest };
