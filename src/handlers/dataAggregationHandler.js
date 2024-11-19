
/**
 * dataAggregation handler
 * src/handlers/dataAggregationHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming dataAggregation messages.
 * @param {Object} model - The incoming model.
 */
async function handleDataAggregationRequest(model) {
  try {
    logger.debug(`[dataAggregationHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { aggregationId, aggregatedData, timestamp } = handleMessageData;
      
    logger.info(`[handleDataAggregation] Processed request successfully: ${aggregationId}, ${aggregatedData}, ${timestamp}`);
  } catch (error) {
    logger.error(`[dataAggregationHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleDataAggregationRequest };
