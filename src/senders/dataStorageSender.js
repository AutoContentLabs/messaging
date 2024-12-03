
/**
 * dataStorage sender
 * src/senders/dataStorageSender.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");

const schemaName = "DATA_STORAGE";
const eventName = "DATA_STORAGE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataStorage to the specified topic.
 * @param {Object} model - The dataStorage request model.
 * @param {String} correlationId - The correlationId used for tracking the request.
 * @throws Will throw an error if sending fails.
 */
async function sendDataStorageRequest(model, correlationId) {
  try {
    logger.debug(`[dataStorageSender] Validating and sending request...`);
    await sender.send(model, correlationId);
    logger.info(`[dataStorageSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataStorageSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataStorageRequest };
