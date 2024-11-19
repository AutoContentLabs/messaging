
/**
 * dataProcessingStatus sender
 * src/senders/dataProcessingStatusSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_PROCESSING_STATUS";
const eventName = "DATA_PROCESSING_STATUS";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataProcessingStatus to the specified topic.
 * @param {Object} model - The dataProcessingStatus request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataProcessingStatusRequest(model) {
  try {
    logger.debug(`[dataProcessingStatusSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataProcessingStatusSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataProcessingStatusSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataProcessingStatusRequest };
