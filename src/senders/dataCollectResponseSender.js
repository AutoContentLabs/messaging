
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
 * 
 * @param {DataCollectRequest} pair.value - The dataCollectRequest request model.
 * @param {string} pair.headers.correlationId - The correlationId used for tracking the request.
 * @param {string} pair.headers.traceId - The traceId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataCollectResponseRequest(pair) {
  try {
    logger.debug(`[dataCollectResponseSender] Validating and sending request...`);
    await sender.send(pair);
    logger.info(`[dataCollectResponseSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataCollectResponseSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataCollectResponseRequest };
