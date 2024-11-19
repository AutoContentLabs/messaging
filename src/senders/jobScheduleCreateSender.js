/**
 * Job Schedule Create Sender
 * src\senders\jobScheduleCreateSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "JOB_SCHEDULE_CREATE";
const eventName = topics.jobScheduleCreate;
const sender = createModel(schemaName, eventName);

/**
 * Sends a job schedule creation request to the specified topic.
 * @param {Object} model - The job schedule creation model.
 * @throws Will throw an error if sending fails.
 */
async function sendJobScheduleCreate(model) {
  try {
    logger.debug("[JobScheduleCreateSender] Validating and sending request...");
    await sender.send(model); // Validation handled in Model
    logger.info("[JobScheduleCreateSender] Request sent successfully.");
  } catch (error) {
    logger.error(`[JobScheduleCreateSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobScheduleCreate };
