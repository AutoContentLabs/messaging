
/**
 * jobProgress sender
 * src/senders/jobProgressSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "JOB_PROGRESS";
const eventName = "JOB_PROGRESS";
const sender = createModel(schemaName, eventName);

/**
 * Sends a jobProgress to the specified topic.
 * @param {Object} model - The jobProgress request model.
 * @throws Will throw an error if sending fails.
 */
async function sendJobProgressRequest(model) {
  try {
    logger.debug(`[jobProgressSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[jobProgressSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobProgressSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobProgressRequest };
