/**
 * Alert sender
 * src/senders/alertSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger.js");

const schemaName = "ALERT";
const eventName = topics.alert;
const sender = createModel(schemaName, eventName);

/**
 * Sends an alert to the specified topic.
 * @param {Object} model - The alert request model.
 * @throws Will throw an error if sending fails.
 */
async function sendAlert(model) {
  try {
    logger.debug("[AlertSender] Validating and sending request...");
    await sender.send(model); // Validation and sending handled by Model
    logger.info("[AlertSender] Request sent successfully.");
  } catch (error) {
    logger.error(`[AlertSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAlert };
