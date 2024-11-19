
/**
 * alert handler
 * src/handlers/alertHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming alert messages.
 * @param {Object} model - The incoming model.
 */
async function handleAlertRequest(model) {
  try {
    logger.debug(`[alertHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { content, level, timestamp } = handleMessageData;
      
    logger.info(`[handleAlert] Processed request successfully: ${content}, ${level}, ${timestamp}`);
  } catch (error) {
    logger.error(`[alertHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAlertRequest };
