
/**
 * jobStatus handler
 * src/handlers/jobStatusHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobStatus messages.
 * @param {Object} model - The incoming model.
 */
async function handleJobStatusRequest(model) {
  try {
    logger.debug(`[jobStatusHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { jobId, status, progress, timestamp } = handleMessageData;
      
    logger.info(`[handleJobStatus] Processed request successfully: ${jobId}, ${status}, ${progress}, ${timestamp}`);
  } catch (error) {
    logger.error(`[jobStatusHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobStatusRequest };
