
/**
 * metric handler
 * src/handlers/metricHandler.js
 */

const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming metric messages.
 * @param {Object} model - The incoming model.
 */
async function handleMetricRequest(model) {
  try {
    logger.debug(`[metricHandler] Processing request...`);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(model);

    // Schema properties destructuring
    const { metricId, value, unit, timestamp } = handleMessageData;
      
    logger.info(`[handleMetric] Processed request successfully: ${metricId}, ${value}, ${unit}, ${timestamp}`);
  } catch (error) {
    logger.error(`[metricHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleMetricRequest };
