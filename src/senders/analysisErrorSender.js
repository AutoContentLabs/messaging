
/**
 * analysisError sender
 * src/senders/analysisErrorSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "ANALYSIS_ERROR";
const eventName = "ANALYSIS_ERROR";
const sender = createModel(schemaName, eventName);

/**
 * Sends a analysisError to the specified topic.
 * @param {Object} model - The analysisError request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendAnalysisErrorRequest(model, correlationId) {
  try {
    logger.debug(`[analysisErrorSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[analysisErrorSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[analysisErrorSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAnalysisErrorRequest };
