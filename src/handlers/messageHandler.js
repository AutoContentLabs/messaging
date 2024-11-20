/**
 * 
 */

const logger = require("../utils/logger");
const { validateData } = require("../utils/validator");
const eventHub = require("../eventHub")
/**
 * Handles an incoming data pair (key-value).
 * 
 * @param {Object} pair - The data pair to process.
 * @param {Object} pair.key - The key in the data pair (optional).
 * @param {Object} pair.value - The value in the data pair (mandatory).
 * @param {number} pair.timestamp - Timestamp of the message.
 * @param {number} pair.headers - headers of the message.
 * 
 * @returns {Object|null} The processed pair data, or null if an error occurs.
 */
async function handleMessage({ key, value, timestamp, headers } = pair) {
    logger.debug(`[handleMessage] Received data`, { key, value, timestamp, headers });

    const safeTimestamp = timestamp || Date.now();
    const safeHeaders = headers || {};

    try {
        if (!value || typeof value !== "object") {
            throw new Error("Invalid value in the received message.");
        }

        const schemaType = safeHeaders?.type;
        if (!schemaType) {
            throw new Error("Message type is missing in headers.");
        }

        const validationErrors = validateData(schemaType, value);
        if (validationErrors) {
            logger.warning(`[handleMessage] Validation errors detected`, { errors: validationErrors });
            throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
        }

        const processedData = { key, value, timestamp: safeTimestamp, headers: safeHeaders };
        logger.info(`[handleMessage] Successfully processed`, processedData);

        // All events
        eventHub.emit(schemaType, processedData)

        return processedData;
    } catch (error) {
        logger.error(`[handleMessage] Error processing message: ${error.message}`, { key, value, timestamp: safeTimestamp, headers: safeHeaders });
        return null;
    }
}

module.exports = { handleMessage };
