
/**
 * report handler
 * src/handlers/reportHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming report messages.
 * @param {Object} model - The incoming model.
 */
async function handleReportRequest(model) {
  try {
    logger.debug(`[reportHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { reportId, content, generatedBy, timestamp } = handleMessageData;
      
    logger.info(`[handleReport] Processed request successfully: ${reportId}, ${content}, ${generatedBy}, ${timestamp}`);
  } catch (error) {
    logger.error(`[reportHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleReportRequest };
