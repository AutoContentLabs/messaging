
/**
 * jobScheduleUpdate handler
 * src/handlers/jobScheduleUpdateHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobScheduleUpdate messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleJobScheduleUpdateRequest(pair) {
  try {
    logger.debug(`[jobScheduleUpdateHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { jobId, schedule, updatedBy } = handleMessageData.value;

    logger.info(`[handleJobScheduleUpdate] Processed request successfully: ${jobId}, ${schedule}, ${updatedBy}`, handleMessageData);
  } catch (error) {
    logger.error(`[jobScheduleUpdateHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobScheduleUpdateRequest };
