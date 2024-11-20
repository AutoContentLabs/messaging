
/**
 * dataAggregation handler
 * src/handlers/dataAggregationHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataAggregation messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleDataAggregationRequest(pair) {
  try {
    logger.debug(`[dataAggregationHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { aggregationId, aggregatedData, timestamp } =  handleMessageData.value;
      
    logger.info(`[handleDataAggregation] Processed request successfully: ${aggregationId}, ${aggregatedData}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[dataAggregationHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataAggregationRequest };
