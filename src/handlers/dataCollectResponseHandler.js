
/**
 * dataCollectResponse handler
 * src/handlers/dataCollectResponseHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataCollectResponse messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataCollectResponseRequest(pair) {
  try {
    logger.debug(`[dataCollectResponseHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring, handleMessageData.value is expected to be of type DataCollectRequest
    /** @type {DataCollectRequest} */
    const { id, service, content } = handleMessageData.value;
    const { service_id, status_type_id, service_type_id, access_type_id, data_format_id, parameters } = service;

    // Determine the service type and handle parameters accordingly
    let model = { id, service, content }

    logger.info(`[handleDataCollectResponse] Processed request successfully: ${id}`, model);
    return model
  } catch (error) {
    logger.error(`[dataCollectResponseHandler] Error processing request: ${error.message}`);
    return null
  }
}

module.exports = { handleDataCollectResponseRequest };
