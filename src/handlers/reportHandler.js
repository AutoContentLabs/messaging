
/**
 * report handler
 * src/handlers/reportHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming report messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleReportRequest(pair) {
  try {
    logger.debug(`[reportHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { reportId, content, generatedBy, timestamp } = handleMessageData.value;

    logger.info(`[handleReport] Processed request successfully: ${reportId}, ${content}, ${generatedBy}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[reportHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleReportRequest };
