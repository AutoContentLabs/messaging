/**
 * Data Collect Request Handler
 * src\handlers\dataCollectRequestHandler.js
 */
const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming data collect requests.
 * @param {Object} model - The incoming data collect request model.
 */
async function handleDataCollectRequest(model) {
  try {
    logger.debug("[DataCollectRequestHandler] Processing request...");

    // Base message handling, including validation
    const data = await handleMessage(model);

    const { id, source, params, priority, timestamp } = data;
    logger.info(`[DataCollectRequestHandler] Processed request: ID: ${id}, Source: ${source}, Priority: ${priority}, Timestamp: ${timestamp}`);

    // Additional logic can be added here
  } catch (error) {
    logger.error(`[DataCollectRequestHandler] Error processing request: ${error.message}`, {
      model,
      stack: error.stack,
    });
  }
}

module.exports = { handleDataCollectRequest };
