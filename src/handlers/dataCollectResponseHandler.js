
/**
 * dataCollectResponse handler
 * src/handlers/dataCollectResponseHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectResponse messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataCollectResponseRequest(pair) {
  try {
    logger.debug(`[dataCollectResponseHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { id, data, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataCollectResponse] Processed request successfully: ${id}, ${data}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataCollectResponseHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectResponseRequest };
