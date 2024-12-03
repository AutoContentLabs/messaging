
/**
 * alert handler
 * src/handlers/alertHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming alert messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleAlertRequest(pair) {
  try {
    logger.debug(`[alertHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { content, level, timestamp } = handleMessageData.value;

    logger.info(`[handleAlert] Processed request successfully: ${content}, ${level}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[alertHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleAlertRequest };
