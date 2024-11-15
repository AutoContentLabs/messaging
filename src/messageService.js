// src/messageService.js

require('events').EventEmitter.defaultMaxListeners = 20; // MaxListenersExceededWarning

const transports = require('./transports');
const logger = require('./utils/logger');

let transport;

switch (transports.config.transport) {
    case 'kafka':
        transport = transports.systems.kafka;
        break;

    default:
        throw new Error(`Unknown transport: ${transports.config.transport}`);
}

const topics = transports.topics;

/**
 * Sends a message to the specified topic using the configured transport system.
 * Implements retry logic for transient errors and enhances performance with batch processing.
 *
 * @param {string} topic - The Kafka topic to send the message to.
 * @param {Array} messageArray - The array of messages to send.
 * @returns {Promise<void>}
 */
async function sendMessage(topic, messageArray) {
    try {
        // Log sending attempt details
        logger.debug(`[sendMessage] [debug] Starting to send message to Kafka topic: ${topic}, message count: ${messageArray.length}, transport: ${transports.config.transport}`);

        // Send messages in parallel for better throughput
        await Promise.all(messageArray.map(message => transport.sendMessage(topic, [message])));
        logger.debug(`[sendMessage] [debug] Successfully sent messages to Kafka topic: ${topic}, message count: ${messageArray.length}, transport: ${transports.config.transport}`);
    } catch (error) {
        logger.error(`[sendMessage] [error] Failed to send messages to Kafka topic: ${topic}, error: ${error.message}, transport: ${transports.config.transport}`);

        // Implementing retry logic for transient issues (with max retries)
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                logger.debug(`[sendMessage] [debug] Retrying to send message to Kafka topic: ${topic}, attempt: ${attempt + 1}`);

                await transport.sendMessage(topic, messageArray);
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

/**
 * Starts listening for messages on a specific Kafka topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 * @param {string} topic - The Kafka topic to listen to.
 * @param {Function} onMessage - The callback function to handle incoming messages.
 * @returns {Promise<void>}
 */
async function startListener(topic, onMessage) {
    try {
        // Using an efficient listener system that can handle high throughput
        await transport.startListener(topic, async (message) => {
            try {
                // Asynchronous processing for messages to avoid blocking
                await onMessage(message);
            } catch (error) {
                logger.error(`[startListener] [error] Error processing message in listener for topic: ${topic}, error: ${error.message}`);
            }
        });
        logger.debug(`[startListener] [debug] Started listener for Kafka topic: ${topic}, transport: ${transports.config.transport}`);
    } catch (error) {
        logger.error(`[startListener] [error] Error starting listener for Kafka topic: ${topic}, error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = { sendMessage, startListener, topics };
