
/**
 * dataProcessingStart handler
 * src/handlers/dataProcessingStartHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingStart messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataProcessingStartRequest(pair) {
  try {
    logger.debug(`[dataProcessingStartHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { taskId, startTime } =  handleMessageData.value;
      
    logger.info(`[handleDataProcessingStart] Processed request successfully: ${taskId}, ${startTime}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataProcessingStartHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingStartRequest };
