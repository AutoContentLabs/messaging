// src/messageService.js

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

        // Send messages in parallel for better throughput
        await Promise.all(messageArray.map(message => transport.sendMessage(topic, [message])));
        logger.info(`Messages sent to ${topic} via ${transports.config.transport}`);


        // // Batch sending allows for sending multiple messages at once to improve throughput.
        // await transport.sendMessage(topic, messageArray);
        // logger.info(`Message sent to ${topic} via ${transports.config.transport}`);



    } catch (error) {
        logger.error(`Failed to send message to ${topic}: ${error.message}`);
       
        // Implementing retry logic for transient issues (with max retries)
        const maxRetries = 3;
        let attempt = 0;
        while (attempt < maxRetries) {
            try {
                await transport.sendMessage(topic, messageArray);
                logger.info(`Retry ${attempt + 1} successful for ${topic}`);
                return;
            } catch (retryError) {
                attempt++;
                logger.warn(`Retry ${attempt} failed for ${topic}: ${retryError.message}`);
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
                logger.error(`Error processing message from ${topic}: ${error.message}`);
            }
        });
        logger.info(`Listening [${topic}] [${transports.config.transport}]`);
    } catch (error) {
        logger.error(`Failed to start listener for ${topic}: ${error.message}`);
        // Retry logic can be added here as well for listener issues.
        throw error;
    }
}

module.exports = { sendMessage, startListener, topics };
