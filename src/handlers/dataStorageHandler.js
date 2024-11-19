
/**
 * dataStorage handler
 * src/handlers/dataStorageHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataStorage messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataStorageRequest(model) {
  try {
    logger.debug(`[dataStorageHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { storageId, data, timestamp } = handleMessageData;
      
    logger.info(`[handleDataStorage] Processed request successfully: ${storageId}, ${data}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataStorageHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataStorageRequest };
