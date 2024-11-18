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
async function handleMessage({ key, value, timestamp, headers } = {}) {
    logger.debug(`[handleMessage] Received data`, { key, value, timestamp, headers });

    try {
        if (!value || typeof value !== "object") {
            throw new Error("Invalid value in the received message.");
        }

        const processedData = { ...key, ...value, timestamp, headers };
        logger.info(`[handleMessage] Successfully processed`, processedData);
        return processedData;
    } catch (error) {
        logger.error(`[handleMessage] Error processing message: ${error.message}`, { key, value, timestamp, headers });
        return null;
    }
}

module.exports = { handleMessage };
