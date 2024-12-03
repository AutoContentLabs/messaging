
/**
 * jobScheduleCreate handler
 * src/handlers/jobScheduleCreateHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobScheduleCreate messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleJobScheduleCreateRequest(pair) {
  try {
    logger.debug(`[jobScheduleCreateHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { jobId, schedule, createdBy, priority } = handleMessageData.value;

    logger.info(`[handleJobScheduleCreate] Processed request successfully: ${jobId}, ${schedule}, ${createdBy}, ${priority}`, handleMessageData);
  } catch (error) {
    logger.error(`[jobScheduleCreateHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobScheduleCreateRequest };
