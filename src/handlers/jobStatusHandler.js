
/**
 * jobStatus handler
 * src/handlers/jobStatusHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobStatus messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleJobStatusRequest(pair) {
  try {
    logger.debug(`[jobStatusHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { jobId, status, progress, timestamp } = handleMessageData.value;

    logger.info(`[handleJobStatus] Processed request successfully: ${jobId}, ${status}, ${progress}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[jobStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobStatusRequest };
