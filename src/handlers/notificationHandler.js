
/**
 * notification handler
 * src/handlers/notificationHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming notification messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleNotificationRequest(pair) {
  try {
    logger.debug(`[notificationHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { recipient, message, type, timestamp } = handleMessageData.value;
      
    logger.info(`[handleNotification] Processed request successfully: ${recipient}, ${message}, ${type}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[notificationHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleNotificationRequest };
