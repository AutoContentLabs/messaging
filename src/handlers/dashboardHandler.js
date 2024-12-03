
/**
 * dashboard handler
 * src/handlers/dashboardHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dashboard messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDashboardRequest(pair) {
  try {
    logger.debug(`[dashboardHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { dashboardId, reportId, content, timestamp } = handleMessageData.value;

    logger.info(`[handleDashboard] Processed request successfully: ${dashboardId}, ${reportId}, ${content}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dashboardHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDashboardRequest };
