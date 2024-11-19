
/**
 * dataCollectResponse sender
 * src/senders/dataCollectResponseSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_COLLECT_RESPONSE";
const eventName = "DATA_COLLECT_RESPONSE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataCollectResponse to the specified topic.
 * @param {Object} model - The dataCollectResponse request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectResponseRequest(model) {
  try {
    logger.debug(`[dataCollectResponseSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataCollectResponseSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectResponseSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectResponseRequest };
