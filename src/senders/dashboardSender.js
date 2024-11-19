
/**
 * dashboard sender
 * src/senders/dashboardSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DASHBOARD";
const eventName = "DASHBOARD";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dashboard to the specified topic.
 * @param {Object} model - The dashboard request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDashboardRequest(model) {
  try {
    logger.debug(`[dashboardSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dashboardSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dashboardSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDashboardRequest };
