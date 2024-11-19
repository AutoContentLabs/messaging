/**
 * Data Collect Request Sender
 * src\senders\dataCollectRequestSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_COLLECT_REQUEST";
const eventName = topics.dataCollectRequest;
const sender = createModel(schemaName, eventName);

/**
 * Sends a data collect request to the specified topic.
 * @param {Object} model - The data collect request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectRequest(model) {
  try {
    logger.debug("[DataCollectRequestSender] Validating and sending request...");
    await sender.send(model); // Validation handled in Model
    logger.info("[DataCollectRequestSender] Request sent successfully.");
  } catch (error) {
    logger.error(`[DataCollectRequestSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectRequest };
