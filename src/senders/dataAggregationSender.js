
/**
 * dataAggregation sender
 * src/senders/dataAggregationSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_AGGREGATION";
const eventName = "DATA_AGGREGATION";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataAggregation to the specified topic.
 * @param {Object} model - The dataAggregation request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataAggregationRequest(model) {
  try {
    logger.debug(`[dataAggregationSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataAggregationSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataAggregationSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataAggregationRequest };
