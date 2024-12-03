const { logger, validator } = require("@auto-content-labs/messaging-utils");
const Schemas = require("../schemas")

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
async function handleMessage(pair = {}) {
    const { key, value, timestamp, headers } = pair;
    const safeTimestamp = timestamp || Date.now();
    const safeHeaders = headers || {};

    logger.debug(`[handleMessage] Received data`, { key, value, timestamp, headers });

    try {
        // Check if value is valid
        if (!value || typeof value !== "object") {
            throw new Error("Invalid value in the received message.");
        }

        const schemaType = safeHeaders?.type;
        if (!schemaType) {
            throw new Error("Message type is missing in headers.");
        }

        // Validate data based on schemaType

        const validationErrors = validator.validateData(Schemas, schemaType, value);
        if (validationErrors) {
            logger.warning(`[handleMessage] Validation errors detected`, { errors: validationErrors });
            throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
        }

        const processedData = { key, value, timestamp: safeTimestamp, headers: safeHeaders };
        logger.info(`[handleMessage] Successfully processed`, processedData);


        return processedData;
    } catch (error) {
        logger.error(`[handleMessage] Error processing message: ${error.message}`, { key, value, timestamp: safeTimestamp, headers: safeHeaders });
        return null;
    }
}

module.exports = { handleMessage };
