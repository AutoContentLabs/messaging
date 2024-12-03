
/**
 * dataProcessingResult sender
 * src/senders/dataProcessingResultSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_PROCESSING_RESULT";
const eventName = "DATA_PROCESSING_RESULT";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataProcessingResult to the specified topic.
 * @param {Object} model - The dataProcessingResult request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataProcessingResultRequest(model, correlationId) {
  try {
    logger.debug(`[dataProcessingResultSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[dataProcessingResultSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataProcessingResultSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataProcessingResultRequest };
