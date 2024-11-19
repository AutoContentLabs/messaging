
/**
 * dataProcessingStart handler
 * src/handlers/dataProcessingStartHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataProcessingStart messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataProcessingStartRequest(model) {
  try {
    logger.debug(`[dataProcessingStartHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { taskId, startTime } = handleMessageData;
      
    logger.info(`[handleDataProcessingStart] Processed request successfully: ${taskId}, ${startTime}`);
  } catch (error) {
    logger.error(`[dataProcessingStartHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataProcessingStartRequest };
