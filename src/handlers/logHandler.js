
/**
 * log handler
 * src/handlers/logHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming log messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleLogRequest(pair) {
  try {
    logger.debug(`[logHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { logId, message, level, timestamp } = handleMessageData.value;

    logger.info(`[handleLog] Processed request successfully: ${logId}, ${message}, ${level}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[logHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleLogRequest };
