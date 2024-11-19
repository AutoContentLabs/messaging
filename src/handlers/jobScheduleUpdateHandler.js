
/**
 * jobScheduleUpdate handler
 * src/handlers/jobScheduleUpdateHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobScheduleUpdate messages.
 * @param {Object} model - The incoming model.
 */
async function handleJobScheduleUpdateRequest(model) {
  try {
    logger.debug(`[jobScheduleUpdateHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { jobId, schedule, updatedBy } = handleMessageData;
      
    logger.info(`[handleJobScheduleUpdate] Processed request successfully: ${jobId}, ${schedule}, ${updatedBy}`);
  } catch (error) {
    logger.error(`[jobScheduleUpdateHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobScheduleUpdateRequest };
