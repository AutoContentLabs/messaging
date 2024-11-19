/**
 * Alert sender
 * src/senders/alertSender.js
 */

const { topics } = require("../topics");
const Model = require("../models/Model");
const logger = require("../utils/logger.js");
const schemaName = topics.alert
const eventName = topics.alert
const alertModel = new Model(schemaName, eventName);

/**
 * Sends an alert to the specified topic with validation.
 * @param {Object} model - The alert model.
 */
async function sendAlert(model) {
  try {
    logger.debug(`[AlertSender] Preparing to send alert`, { model: JSON.stringify(model) });
    await alertModel.send(model);
    logger.info("[AlertSender] Alert sent successfully.");
  } catch (error) {
    logger.error(`[AlertSender] Failed to send alert: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAlert };
