
/**
 * jobScheduleCreate handler
 * src/handlers/jobScheduleCreateHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming jobScheduleCreate messages.
 * @param {Object} model - The incoming model.
 */
async function handleJobScheduleCreateRequest(model) {
  try {
    logger.debug(`[jobScheduleCreateHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { jobId, schedule, createdBy, priority } = handleMessageData;
      
    logger.info(`[handleJobScheduleCreate] Processed request successfully: ${jobId}, ${schedule}, ${createdBy}, ${priority}`);
  } catch (error) {
    logger.error(`[jobScheduleCreateHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleJobScheduleCreateRequest };
