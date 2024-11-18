/**
 * src\handlers\messageHandler.js
 */

const logger = require("../utils/logger");

/**
 * @typedef {Object} Pair
 * @property {JSON} key - The key in the data pair (optional).
 * @property {JSON} value - The value in the data pair (mandatory).
 */

/**
 * Handles an incoming data pair (key-value).
 * 
 * This function processes a data pair (key, value), where both key and value
 * are JSON objects. The function logs the received data to the console.
 * @param {Pair} pair - The data pair to process.
 * @param {Object} pair - The data pair to process.
 * @param {JSON} pair.key - The key in the data pair (optional).
 * @param {JSON} pair.value - The value in the data pair (mandatory).
 * 
 * @example
 * // Example usage:
 * handleMessage({ key: { id: 1 }, value: { content: 'Hello' } });
 * // Logs: Received data: { key: { id: 1 }, value: { content: 'Hello' } }
 */
async function handleMessage({ key, value, timestamp } = pair) {

    logger.debug(`[handleMessage] [debug] Received - key: ${JSON.stringify(key)} value: ${JSON.stringify(value)} timestamp: ${timestamp}`);

    try {
        // Attempt to parse the value assuming it's a JSON object

        if (value) {
            try {

                // do something

                const data = { ...key, ...value, timestamp }
                logger.notice(`[handleMessage] ${JSON.stringify(data)}`)
                return data

            } catch (error) {
                logger.warning(`[handleMessage] [warn] Failed to pair value as JSON -  error: ${error.message}, value: ${value.toString()}`);
                return null
            }
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[handleMessage] [error] Error processing Kafka message - error: ${error.message}`);
    }
}

module.exports = { handleMessage };