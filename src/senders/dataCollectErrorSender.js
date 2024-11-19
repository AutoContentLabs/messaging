
/**
 * dataCollectError sender
 * src/senders/dataCollectErrorSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_COLLECT_ERROR";
const eventName = "DATA_COLLECT_ERROR";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataCollectError to the specified topic.
 * @param {Object} model - The dataCollectError request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectErrorRequest(model) {
  try {
    logger.debug(`[dataCollectErrorSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataCollectErrorSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectErrorSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectErrorRequest };
