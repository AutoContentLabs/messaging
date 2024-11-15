const logger = require("./utils/logger");

/**
 * Handles incoming messages.
 * 
 * @param {string} topic - The topic from which the message was received.
 * @param {number} partition - The partition number from which the message was received.
 * @param {Object} message - The message object containing key, value, timestamp, and offset.
 * @param {Buffer} message.key - The key of the message.
 * @param {Buffer} message.value - The value of the message (the main data payload).
 * @param {string} message.timestamp - The timestamp of the message.
 * @param {string} message.offset - The offset of the message in the partition.
 */
async function onMessage({ topic, partition, message }) {
    const key = message.key ? message.key.toString() : null;
    const offset = message.offset;
    const timestamp = message.timestamp;
    const value = message.value; // from buffer

    // Log the message header details
    logger.debug(`[onMessage] [debug] Received message - topic: ${topic}, partition: ${partition}, key: ${key}, offset: ${offset}, timestamp: ${timestamp}`);

    try {
        // Attempt to parse the value assuming it's a JSON object
        let parsedValue;
        if (value) {
            try {
                parsedValue = JSON.parse(value.toString());
                logger.debug(`[onMessage] [debug] Parsed message value successfully - topic: ${topic}, parsedValue: ${JSON.stringify(parsedValue)}`);
            } catch (error) {
                logger.warn(`[onMessage] [warn] Failed to parse message value as JSON - topic: ${topic}, error: ${error.message}, value: ${value.toString()}`);
            }
        }

        // Log parsed value or raw value if parsing failed
        if (!parsedValue) {
            logger.debug(`[onMessage] [debug] Message value as string - topic: ${topic}, value: ${value.toString()}`);
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`[onMessage] [error] Error processing Kafka message - topic: ${topic}, partition: ${partition}, error: ${error.message}`);
    }
}

module.exports = { onMessage };
