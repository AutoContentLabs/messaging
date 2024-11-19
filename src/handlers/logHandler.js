
/**
 * log handler
 * src/handlers/logHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming log messages.
 * @param {Object} model - The incoming model.
 */
async function handleLogRequest(model) {
  try {
    logger.debug(`[logHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { logId, message, level, timestamp } = handleMessageData;
      
    logger.info(`[handleLog] Processed request successfully: ${logId}, ${message}, ${level}, ${timestamp}`);
  } catch (error) {
    logger.error(`[logHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleLogRequest };
