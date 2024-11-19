
/**
 * metric sender
 * src/senders/metricSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "METRIC";
const eventName = "METRIC";
const sender = createModel(schemaName, eventName);

/**
 * Sends a metric to the specified topic.
 * @param {Object} model - The metric request model.
 * @throws Will throw an error if sending fails.
 */
async function sendMetricRequest(model) {
  try {
    logger.debug(`[metricSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[metricSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[metricSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendMetricRequest };
