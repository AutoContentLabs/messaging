/**
 * src\handlers\messageHandler.js
 */

const logger = require("../utils/logger");

/**
 * Handles incoming messages.
 * 
 * @param {Object} dataPackage - The parameters for the function.
 * @param {string} dataPackage.topic - The topic from which the message was received.
 * @param {Object} dataPackage.pair - The message object containing key, value, timestamp, and offset.
 * @param {Buffer} dataPackage.pair.key - The key of the message.
 * @param {Buffer} dataPackage.pair.value - The value of the message (the main data payload).
 * @param {string} dataPackage.pair.timestamp - The timestamp of the message.
 * @param {string} dataPackage.pair.offset - The offset of the message in the partition.
 * @param {number} dataPackage.partition - The partition number from which the message was received.
 */
async function handleMessage({ topic, pair, partition } = dataPackage) {

    const key = pair.key ? pair.key.toString() : null;
    const value = pair.value; // from buffer

    const offset = pair.offset;
    const timestamp = pair.timestamp;

    // Log the message header details
    logger.debug(`[handleMessage] [debug] Received message - topic: ${topic}, partition: ${partition}, key: ${key}, offset: ${offset}, timestamp: ${timestamp}`);

    try {
        // Attempt to parse the value assuming it's a JSON object
        let parsedValue;
        if (value) {
            try {
                parsedValue = JSON.parse(value.toString());
                logger.debug(`[handleMessage] [debug] Parsed message value successfully - topic: ${topic}, parsedValue: ${JSON.stringify(parsedValue)}`);
            } catch (error) {
                logger.warn(`[handleMessage] [warn] Failed to parse message value as JSON - topic: ${topic}, error: ${error.message}, value: ${value.toString()}`);
            }
        }

        // Log parsed value or raw value if parsing failed
        if (!parsedValue) {
            logger.debug(`[handleMessage] [debug] Message value as string - topic: ${topic}, value: ${value.toString()}`);
        }
        // parsed value is data model
        return parsedValue

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[handleMessage] [error] Error processing Kafka message - topic: ${topic}, partition: ${partition}, error: ${error.message}`);
    }
}

module.exports = { handleMessage };
