
/**
 * analysisRequest sender
 * src/senders/analysisRequestSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "ANALYSIS_REQUEST";
const eventName = "ANALYSIS_REQUEST";
const sender = createModel(schemaName, eventName);

/**
 * Sends a analysisRequest to the specified topic.
 * @param {Object} model - The analysisRequest request model.
 * @throws Will throw an error if sending fails.
 */
async function sendAnalysisRequestRequest(model) {
  try {
    logger.debug(`[analysisRequestSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[analysisRequestSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[analysisRequestSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAnalysisRequestRequest };
