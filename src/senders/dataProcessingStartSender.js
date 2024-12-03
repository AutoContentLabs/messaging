
/**
 * dataProcessingStart sender
 * src/senders/dataProcessingStartSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_PROCESSING_START";
const eventName = "DATA_PROCESSING_START";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataProcessingStart to the specified topic.
 * @param {Object} model - The dataProcessingStart request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataProcessingStartRequest(model, correlationId) {
  try {
    logger.debug(`[dataProcessingStartSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[dataProcessingStartSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataProcessingStartSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataProcessingStartRequest };
