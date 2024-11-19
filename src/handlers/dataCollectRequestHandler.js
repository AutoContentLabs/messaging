
/**
 * dataCollectRequest handler
 * src/handlers/dataCollectRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectRequest messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataCollectRequestRequest(model) {
  try {
    logger.debug(`[dataCollectRequestHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { id, source, params, priority, timestamp } = handleMessageData;
      
    logger.info(`[handleDataCollectRequest] Processed request successfully: ${id}, ${source}, ${params}, ${priority}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataCollectRequestHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectRequestRequest };
