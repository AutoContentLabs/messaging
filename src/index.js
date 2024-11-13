// src/index.js

const transports = require('./transports');  // Importing transport modules
const logger = require("./utils/logger")
const { onMessage } = require("./messageHandler")

// Initialize transport system based on configuration
let transport;

switch (transports.config.transport) {
    case 'kafka':
        transport = transports.systems.kafka;  // Use Kafka transport system
        break;
    // Future transports can be added here, for example:
    // case 'mqtt':
    //     transport = transports.systems.mqtt;
    //     break;

    default:
        throw new Error(`Unknown transport: ${transports.config.transport}`);  // Error for unsupported transports
}

/**
 * Sends a message to the specified topic using the configured transport system.
 * 
 * @param {string} topic - The Kafka topic (or other transport topic) to send the message to.
 * @param {Buffer[]} messageArray - The message data, can be binary or string, based on transport system.
 * @returns {Promise<void>} - A promise indicating the result of the operation.
 */
async function sendMessage(topic, messageArray) {
    try {
        // Delegate the message sending to the configured transport system
        await transport.sendMessage(topic, messageArray);
        logger.info(`Message sent to ${topic} via ${transports.config.transport}`);
    } catch (error) {
        logger.error(`Failed to send message to ${topic}: ${error.message}`);
        throw error;  // Propagate error for further handling if needed
    }
}

/**
 * Starts to listen to a given topic and process messages.
 * 
 * @param {string} topic - topic to listen to.
 * @param {Function} onMessage - The callback function to process each message.
 *        The callback should have the following signature:
 *        `onMessageCallback(topic: string, partition: number, message: { key: Buffer, value: Buffer, timestamp: string, offset: string })`
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function startListener(topic, onMessage) {
    try {
        // Delegate the listener setup to the configured transport system
        await transport.startListener(topic, onMessage);
        logger.info(`Listening [${topic}] [${transports.config.transport}]`);
    } catch (error) {
        logger.error(`Failed to start listener for ${topic}: ${error.message}`);
        throw error;  // Propagate error for further handling if needed
    }
}

// Export the transport-related methods and the topics configuration
const topics = transports.topics;  // Assuming 'topics' is an object containing topic names and related configurations
module.exports = { sendMessage, startListener, onMessage, topics };
