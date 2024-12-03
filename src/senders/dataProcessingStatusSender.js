
/**
 * dataProcessingStatus sender
 * src/senders/dataProcessingStatusSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_PROCESSING_STATUS";
const eventName = "DATA_PROCESSING_STATUS";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataProcessingStatus to the specified topic.
 * @param {Object} model - The dataProcessingStatus request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataProcessingStatusRequest(model, correlationId) {
  try {
    logger.debug(`[dataProcessingStatusSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[dataProcessingStatusSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataProcessingStatusSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataProcessingStatusRequest };
