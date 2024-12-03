
/**
 * analysisResult sender
 * src/senders/analysisResultSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "ANALYSIS_RESULT";
const eventName = "ANALYSIS_RESULT";
const sender = createModel(schemaName, eventName);

/**
 * Sends a analysisResult to the specified topic.
 * @param {Object} model - The analysisResult request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendAnalysisResultRequest(model, correlationId) {
  try {
    logger.debug(`[analysisResultSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[analysisResultSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[analysisResultSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendAnalysisResultRequest };
