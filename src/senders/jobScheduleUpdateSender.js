
/**
 * jobScheduleUpdate sender
 * src/senders/jobScheduleUpdateSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "JOB_SCHEDULE_UPDATE";
const eventName = "JOB_SCHEDULE_UPDATE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a jobScheduleUpdate to the specified topic.
 * @param {Object} model - The jobScheduleUpdate request model.
 * @throws Will throw an error if sending fails.
 */
async function sendJobScheduleUpdateRequest(model) {
  try {
    logger.debug(`[jobScheduleUpdateSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[jobScheduleUpdateSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobScheduleUpdateSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobScheduleUpdateRequest };
