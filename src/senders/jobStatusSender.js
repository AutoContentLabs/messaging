
/**
 * jobStatus sender
 * src/senders/jobStatusSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "JOB_STATUS";
const eventName = "JOB_STATUS";
const sender = createModel(schemaName, eventName);

/**
 * Sends a jobStatus to the specified topic.
 * @param {Object} model - The jobStatus request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendJobStatusRequest(model, correlationId) {
  try {
    logger.debug(`[jobStatusSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[jobStatusSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[jobStatusSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendJobStatusRequest };
