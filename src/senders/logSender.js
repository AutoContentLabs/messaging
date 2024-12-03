
/**
 * log sender
 * src/senders/logSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "LOG";
const eventName = "LOG";
const sender = createModel(schemaName, eventName);

/**
 * Sends a log to the specified topic.
 * @param {Object} model - The log request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendLogRequest(model, correlationId) {
  try {
    logger.debug(`[logSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[logSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[logSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendLogRequest };
