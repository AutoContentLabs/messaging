
/**
 * dataStorage handler
 * src/handlers/dataStorageHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataStorage messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataStorageRequest(pair) {
  try {
    logger.debug(`[dataStorageHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { storageId, data, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataStorage] Processed request successfully: ${storageId}, ${data}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataStorageHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataStorageRequest };
