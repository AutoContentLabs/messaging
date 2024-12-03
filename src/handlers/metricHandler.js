
/**
 * metric handler
 * src/handlers/metricHandler.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming metric messages.
 * @param {Object} pair - The incoming model source.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The incoming model data
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - Headers of the message.
 */
async function handleMetricRequest(pair) {
  try {
    logger.debug(`[metricHandler] Processing request...`, pair);

    // Base message handling, including validation
    const handleMessageData = await handleMessage(pair);

    // Schema properties destructuring
    const { metricId, value, unit, timestamp } = handleMessageData.value;

    logger.info(`[handleMetric] Processed request successfully: ${metricId}, ${value}, ${unit}, ${timestamp}`, handleMessageData);
  } catch (error) {
    logger.error(`[metricHandler] Error processing request: ${error.message}`);
  }
}

module.exports = { handleMetricRequest };
