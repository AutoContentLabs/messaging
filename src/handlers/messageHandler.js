/**
 * src\handlers\messageHandler.js
 */
const logger = require("../utils/logger");

/**
 * Handles an incoming data pair (key-value).
 * 
 * This function processes a data pair (key, value), where both key and value
 * are JSON objects.
 * @param {Object} pair - The data pair to process.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The value in the data pair (mandatory).
 * @param {number} pair.timestamp - Timestamp of the message.
 * 
 * @returns {Object|null} The processed data, or null if an error occurs.
 */
async function handleMessage({ key, value, timestamp } = {}) {
    logger.debug(`[handleMessage] Received data - key: ${JSON.stringify(key)}, value: ${JSON.stringify(value)}, timestamp: ${timestamp}`);

    try {
        if (!value || typeof value !== "object") {
            throw new Error("Invalid value in the received message.");
        }

        const processedData = { ...key, ...value, timestamp };
        logger.notice(`[handleMessage] Successfully: ${JSON.stringify(processedData)}`);
        return processedData;
    } catch (error) {
        logger.error(`[handleMessage] Error processing message: ${error.message}`);
        return null;
    }
}

module.exports = { handleMessage };
