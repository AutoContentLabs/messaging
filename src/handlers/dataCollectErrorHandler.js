
/**
 * dataCollectError handler
 * src/handlers/dataCollectErrorHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectError messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataCollectErrorRequest(pair) {
  try {
    logger.debug(`[dataCollectErrorHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { id, errorCode, errorMessage, timestamp } = handleMessageData.value;
      
    logger.info(`[handleDataCollectError] Processed request successfully: ${id}, ${errorCode}, ${errorMessage}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataCollectErrorHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectErrorRequest };
