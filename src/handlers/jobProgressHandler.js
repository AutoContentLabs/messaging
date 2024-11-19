
/**
 * jobProgress handler
 * src/handlers/jobProgressHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobProgress messages.
 * @param {Object} model - The incoming model.
 */
async function handleJobProgressRequest(model) {
  try {
    logger.debug(`[jobProgressHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { jobId, progress, timestamp } = handleMessageData;
      
    logger.info(`[handleJobProgress] Processed request successfully: ${jobId}, ${progress}, ${timestamp}`);
  } catch (error) {
    logger.error(`[jobProgressHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobProgressRequest };
