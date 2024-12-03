
/**
 * alert sender
 * src/senders/alertSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "ALERT";
const eventName = "ALERT";
const sender = createModel(schemaName, eventName);

/**
 * Sends a alert to the specified topic.
 * @param {Object} model - The alert request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendAlertRequest(model, correlationId) {
  try {
    logger.debug(`[alertSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[alertSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[alertSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAlertRequest };
