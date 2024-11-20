
/**
 * dataProcessingStatus handler
 * src/handlers/dataProcessingStatusHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingStatus messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataProcessingStatusRequest(pair) {
  try {
    logger.debug(`[dataProcessingStatusHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { taskId, status, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataProcessingStatus] Processed request successfully: ${taskId}, ${status}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataProcessingStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingStatusRequest };
