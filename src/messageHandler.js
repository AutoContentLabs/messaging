// example/messageHandler.js

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

    logger.info(`Received: [${topic}] [${partition}] [${key}] [${offset}] [${timestamp}] `);
    logger.debug(`${value} `);
}

module.exports = { onMessage }