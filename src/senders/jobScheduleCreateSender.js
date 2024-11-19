
/**
 * jobScheduleCreate sender
 * src/senders/jobScheduleCreateSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "JOB_SCHEDULE_CREATE";
const eventName = "JOB_SCHEDULE_CREATE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a jobScheduleCreate to the specified topic.
 * @param {Object} model - The jobScheduleCreate request model.
 * @throws Will throw an error if sending fails.
 */
async function sendJobScheduleCreateRequest(model) {
  try {
    logger.debug(`[jobScheduleCreateSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[jobScheduleCreateSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobScheduleCreateSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobScheduleCreateRequest };
