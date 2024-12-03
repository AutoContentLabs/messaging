
/**
 * report sender
 * src/senders/reportSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "REPORT";
const eventName = "REPORT";
const sender = createModel(schemaName, eventName);

/**
 * Sends a report to the specified topic.
 * @param {Object} model - The report request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendReportRequest(model, correlationId) {
  try {
    logger.debug(`[reportSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[reportSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[reportSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendReportRequest };
