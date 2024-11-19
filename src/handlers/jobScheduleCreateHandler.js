/**
 * Job Schedule Create Handler
 * src\handlers\jobScheduleCreateHandler.js
 */
const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming job schedule creation requests.
 * @param {Object} model - The incoming job schedule creation model.
 */
async function handleJobScheduleCreate(model) {
  try {
    logger.debug("[JobScheduleCreateHandler] Processing job schedule creation...");

    // Base message handling, including validation
    const data = await handleMessage(model);

    const { jobId, schedule, createdBy, priority } = data;
    logger.info(`[JobScheduleCreateHandler] Processed job schedule: Job ID: ${jobId}, Schedule: ${schedule}, Priority: ${priority}, Created By: ${createdBy}`);

    // Additional logic can be added here
  } catch (error) {
    logger.error(`[JobScheduleCreateHandler] Error processing job schedule: ${error.message}`, {
      model,
      stack: error.stack,
    });
  }
}

module.exports = { handleJobScheduleCreate };
