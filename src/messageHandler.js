const logger = require("./utils/logger");

/**
 * Handles incoming messages.
 * 
 * @param {string} topic - The Kafka topic from which the message was received.
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
    logger.info(`Received: [${topic}] [${partition}] [${key}] [${offset}] [${timestamp}]`);

    try {
        // Attempt to parse the value assuming it's a JSON object
        let parsedValue;
        if (value) {
            try {
                parsedValue = JSON.parse(value.toString());
            } catch (error) {
                logger.warn(`Failed to parse message value as JSON. Raw data: ${value.toString()}`);
            }
        }

        // Log parsed value if available
        if (parsedValue) {
            logger.debug(`Parsed Value: ${JSON.stringify(parsedValue)}`);
        } else {
            logger.debug(`Message Value (non-parsed): ${value.toString()}`);
        }

    } catch (error) {
        // Log any error during the processing of the message
        logger.error(`Error processing message: ${error.message}`);
    }
}

module.exports = { onMessage };
