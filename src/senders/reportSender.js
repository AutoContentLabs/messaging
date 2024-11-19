
/**
 * report sender
 * src/senders/reportSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "REPORT";
const eventName = "REPORT";
const sender = createModel(schemaName, eventName);

/**
 * Sends a report to the specified topic.
 * @param {Object} model - The report request model.
 * @throws Will throw an error if sending fails.
 */
async function sendReportRequest(model) {
  try {
    logger.debug(`[reportSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[reportSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[reportSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendReportRequest };
