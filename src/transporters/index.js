/**
 * src\transporters\index.js
 */
/**
 * Transporters Module
 * This module aggregates the Kafka transporter and exposes its functionality
 * for sending and listening to messages from Kafka topics.
 * 
 * @module src/transporters
 */

const kafkaTransporter = require("./kafkaTransporter");

/**
 * Exposes Kafka transporter functionality.
 * 
 * This module exports the following:
 * - **Name**: The name of the Kafka transporter.
 * - **listenMessage**: Function to start listening to Kafka messages from a topic.
 * - **sendMessage**: Function to send messages to a Kafka topic.
 * 
 * @example
 * const { kafka } = require('./path/to/this/file');
 * kafka.listenMessage('topicName', handler);
 * kafka.sendMessage('topicName', { key: keyData, value: valueData });
 * 
 * @exports
 */
module.exports = {

    kafka: {
        /**
         * The name of the Kafka transporter.
         * 
         * @type {string}
         */
        Name: kafkaTransporter.Name,

        /**
         * Listens to messages from the specified Kafka topic and processes them with the provided handler.
         * 
         * @param {string} topic - The topic to listen to.
         * @param {Function} handler - The handler function to process incoming messages.
         * @param {Object} handler.pair - The message data object.
         * @param {Object} handler.pair.key - The optional key of the message (in JSON format).
         * @param {Object} handler.pair.value - The value of the message (in JSON format).
         * 
         * @returns {Promise<void>} A promise indicating the completion of the listener setup.
         * 
         * @example
         * kafka.listenMessage('topicName', (data) => {
         *     console.log(data); // Process the message here
         * });
         */
        listenMessage: kafkaTransporter.listenMessage,

        /**
         * Sends a message to the specified  topic.
         * 
         * @param {string} topic - The topic to send the message to.
         * @param {Object} pair - The message data.
         * @param {Object} pair.key - The optional key of the message (in JSON format).
         * @param {Object} pair.value - The value of the message (in JSON format).
         * 
         * @returns {Promise<void>} A promise indicating the completion of the message send operation.
         * 
         * @example
         * kafka.sendMessage('topicName', { key: keyData, value: valueData });
         */
        sendMessage: kafkaTransporter.sendMessage,

        /**
         * Sends multiple binary data (Buffer) messages.
         * The producer instance is reused for multiple sends.
         * 
         * @param {string} topic - The topic to which the messages will be sent.
         * @param {Array<{ key: Object, value: Object }>} messages - An array of message data objects.
         * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
         * 
         * @example
         * const topic = "testTopic";
         * const messages = [
         *  { key: { id: 1 }, value: { content: "Message 1" } },
         *  { key: { id: 2 }, value: { content: "Message 2" } },
         *  { key: { id: 3 }, value: { content: "Message 3" } },
         * ];
         * 
         * sendMessages(topic, messages);
         * 
         */
        sendMessages: kafkaTransporter.sendMessages
    }
};