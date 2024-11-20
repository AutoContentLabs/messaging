
/**
 * dataCollectStatus handler
 * src/handlers/dataCollectStatusHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectStatus messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataCollectStatusRequest(pair) {
  try {
    logger.debug(`[dataCollectStatusHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { id, status, message, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataCollectStatus] Processed request successfully: ${id}, ${status}, ${message}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataCollectStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectStatusRequest };
