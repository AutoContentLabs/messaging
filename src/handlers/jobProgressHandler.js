
/**
 * jobProgress handler
 * src/handlers/jobProgressHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobProgress messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleJobProgressRequest(pair) {
  try {
    logger.debug(`[jobProgressHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { jobId, progress, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleJobProgress] Processed request successfully: ${jobId}, ${progress}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[jobProgressHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobProgressRequest };
