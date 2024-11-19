/**
 * Alert sender
 * src/senders/alertSender.js
 */

const { topics } = require("../topics");
const Model = require("../models/Model");
const logger = require("../utils/logger.js");

const schemaName = topics.alert;
const eventName = topics.alert;
const alertModel = new Model(schemaName, eventName);

/**
 * Sends an alert to the specified topic.
 * @param {Object} model - The alert model.
 * @throws Will throw an error if sending fails.
 */
async function sendAlert(model) {
  try {
    logger.debug("[AlertSender] Sending alert...");
    await alertModel.send(model); // Validation and sending handled by Model
    logger.info("[AlertSender] Alert sent successfully.");
  } catch (error) {
    logger.error(`[AlertSender] Error sending alert: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAlert };
