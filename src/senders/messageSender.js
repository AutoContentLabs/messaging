/**
 * src\senders\messageSender.js
 */

const logger = require("../utils/logger")
const transporters = require("../transporters")
const transporter = transporters.kafka
const transporter_name = transporter.Name

/**
 * Sends a message to the specified topic using the configured transport system.
 * Implements retry logic for transient errors and enhances performance with batch processing.
 *
 * @param {string} topic - The Kafka topic to send the message to.
 * @param {Array} pairs - The array of messages to send.
 * @returns {Promise<void>}
 */
async function sendMessage(topic, pairs) {
    try {
        // Log sending attempt details
        logger.debug(`[sendMessage] [debug] Starting to send message to Kafka topic: ${topic}, message count: ${pairs.length}, transport: ${transporter_name}`);

        // Send messages in parallel for better throughput
        await Promise.all(pairs.map(pair => transporter.sendMessage(topic, [pair])));
        logger.debug(`[sendMessage] [debug] Successfully sent messages to Kafka topic: ${topic}, message count: ${pairs.length}, transport: ${transporter_name}`);
    } catch (error) {
        logger.error(`[sendMessage] [error] Failed to send messages to Kafka topic: ${topic}, error: ${error.message}, transport: ${transporter_name}`);

        // Implementing retry logic for transient issues (with max retries)
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                logger.debug(`[sendMessage] [debug] Retrying to send message to Kafka topic: ${topic}, attempt: ${attempt + 1}`);

                await transporter.sendMessage(topic, pairs);
                logger.debug(`[sendMessage] [debug] Successfully retried sending messages to Kafka topic: ${topic}, attempt: ${attempt + 1}`);
                return;
            } catch (retryError) {
                attempt++;
                logger.warn(`[sendMessage] [warn] Retry attempt failed to send message to Kafka topic: ${topic}, attempt: ${attempt}, retry error: ${retryError.message}`);
            }
        }

        // After max retries, throw the error to notify the system
        throw new Error(`Failed to send message to ${topic} after ${maxRetries} retries`);
    }
}

module.exports = { sendMessage };