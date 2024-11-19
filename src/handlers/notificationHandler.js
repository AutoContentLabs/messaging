
/**
 * notification handler
 * src/handlers/notificationHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming notification messages.
 * @param {Object} model - The incoming model.
 */
async function handleNotificationRequest(model) {
  try {
    logger.debug(`[notificationHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { recipient, message, type, timestamp } = handleMessageData;
      
    logger.info(`[handleNotification] Processed request successfully: ${recipient}, ${message}, ${type}, ${timestamp}`);
  } catch (error) {
    logger.error(`[notificationHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleNotificationRequest };
