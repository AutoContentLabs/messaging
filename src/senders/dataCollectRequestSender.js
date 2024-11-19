
/**
 * dataCollectRequest sender
 * src/senders/dataCollectRequestSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_COLLECT_REQUEST";
const eventName = "DATA_COLLECT_REQUEST";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataCollectRequest to the specified topic.
 * @param {Object} model - The dataCollectRequest request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectRequestRequest(model) {
  try {
    logger.debug(`[dataCollectRequestSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataCollectRequestSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectRequestSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectRequestRequest };
