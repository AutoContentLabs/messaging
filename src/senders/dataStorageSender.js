
/**
 * dataStorage sender
 * src/senders/dataStorageSender.js
 */

const { topics } = require("../topics");
const { createModel } = require("../models/createModel");
const logger = require("../utils/logger");

const schemaName = "DATA_STORAGE";
const eventName = "DATA_STORAGE";
const sender = createModel(schemaName, eventName);

/**
 * Sends a dataStorage to the specified topic.
 * @param {Object} model - The dataStorage request model.
 * @throws Will throw an error if sending fails.
 */
async function sendDataStorageRequest(model) {
  try {
    logger.debug(`[dataStorageSender] Validating and sending request...`);
    await sender.send(model);
    logger.info(`[dataStorageSender] Request sent successfully.`);
  } catch (error) {
    logger.error(`[dataStorageSender] Failed to send request: ${error.message}`);
    throw error;
  }
}

module.exports = { sendDataStorageRequest };
