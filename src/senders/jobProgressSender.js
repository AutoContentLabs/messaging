
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
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendJobProgressRequest(model, correlationId) {
  try {
    logger.debug(`[jobProgressSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[jobProgressSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobProgressSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobProgressRequest };
