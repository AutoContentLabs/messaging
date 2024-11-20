
/**
 * dataCollectRequest handler
 * src/handlers/dataCollectRequestHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectRequest messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataCollectRequestRequest(pair) {
  try {
    logger.debug(`[dataCollectRequestHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { id, source, params, priority, timestamp } =  handleMessageData.value;

    logger.info(`[handleDataCollectRequest] Processed request successfully: ${id}, ${source}, ${params}, ${priority}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataCollectRequestHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataCollectRequestRequest };
