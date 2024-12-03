
/**
 * dataCollectStatus sender
 * src/senders/dataCollectStatusSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_COLLECT_STATUS";
const eventName = "DATA_COLLECT_STATUS";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataCollectStatus to the specified topic.
 * @param {Object} model - The dataCollectStatus request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectStatusRequest(model, correlationId) {
  try {
    logger.debug(`[dataCollectStatusSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[dataCollectStatusSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectStatusSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectStatusRequest };
