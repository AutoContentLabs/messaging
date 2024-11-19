
/**
 * dashboard handler
 * src/handlers/dashboardHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dashboard messages.
 * @param {Object} model - The incoming model.
 */
async function handleDashboardRequest(model) {
  try {
    logger.debug(`[dashboardHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { dashboardId, reportId, content, timestamp } = handleMessageData;
      
    logger.info(`[handleDashboard] Processed request successfully: ${dashboardId}, ${reportId}, ${content}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dashboardHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDashboardRequest };
