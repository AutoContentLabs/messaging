
/**
 * notification sender
 * src/senders/notificationSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "NOTIFICATION";
const eventName = "NOTIFICATION";
const sender = createModel(schemaName, eventName);

/**
 * Sends a notification to the specified topic.
 * @param {Object} model - The notification request model.
 * @throws Will throw an error if sending fails.
 */
async function sendNotificationRequest(model) {
  try {
    logger.debug(`[notificationSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[notificationSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[notificationSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendNotificationRequest };
