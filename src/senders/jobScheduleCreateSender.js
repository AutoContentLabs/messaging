
/**
 * jobScheduleCreate sender
 * src/senders/jobScheduleCreateSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "JOB_SCHEDULE_CREATE";
const eventName = "JOB_SCHEDULE_CREATE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a jobScheduleCreate to the specified topic.
 * @param {Object} model - The jobScheduleCreate request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendJobScheduleCreateRequest(model, correlationId) {
  try {
    logger.debug(`[jobScheduleCreateSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[jobScheduleCreateSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobScheduleCreateSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobScheduleCreateRequest };
