/**
 * src/transporters/kafkaTransporter.js
 */
const { serialize, deserialize, MESSAGE_FORMATS } = require("../utils/transformer");
const logger = require("../utils/logger");
const KafkaListener = require("./kafka/KafkaListener");
const KafkaAdmin = require("./kafka/KafkaAdmin");

const kafkaListener = new KafkaListener();
const kafkaAdmin = new KafkaAdmin();

const KafkaSender = require("./kafka/KafkaSender");
const kafkaSender = new KafkaSender();

/**
 * Starts the Kafka consumer listener to ensure it is connected and ready.
 * 
 * This function checks the Kafka topics and connects the consumer.
 * 
 * @returns {Promise<void>} - A promise indicating the completion of the listener start-up process.
 */
async function StartListener() {
    try {
        // // first connection and check
        // await kafkaAdmin.checkTopics();
        // await kafkaListener.kafkaConsumer.connect();
        // which method is better
        if (kafkaListener.kafkaConsumer.status !== 'CONNECTED') {
            // first connection and check
            await kafkaAdmin.checkTopics();
            await kafkaListener.kafkaConsumer.connect();
        }
    } catch (error) {
        logger.error(`[KafkaTransporter] [StartListener] Error Kafka Transporter Listener...: ${error}`);
    }
}

/**
 * Listens for incoming messages and triggers a handler when a specific message is received.
 * 
 * This function listens for a particular event (message) and, when triggered, it invokes
 * the specified handler with the message data. The handler should be a function that can 
 * handle a data pair, such as the `handleMessage` function.
 * 
 * @param {string} topic - The name of the event to listen for.
 * @param {function({ key: (any|undefined), value: any })} handler - The callback function to handle the message data. The handler
 *                              should expect an object containing a `key` and `value`, both of 
 *                              which are JSON objects.
 * @param {Object} handler.pair - The data object containing key-value pair from the Kafka message.
 * @param {Object} handler.pair.key - The optional key of the message in JSON format.
 * @param {Object} handler.pair.value - The value of the message in JSON format.
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 * 
 * @example
 * // Example usage:
 * listenMessage("test", ({ key, value }) => {
 *     console.log(key, value);  // key is optional, value is required
 * });
 */
async function listenMessage(topic, handler, format = MESSAGE_FORMATS.JSON) {

    try {

        if (typeof handler !== 'function') {
            throw new Error('Provided handler is not a function');
        }

        await StartListener();

        logger.info(`[listenMessage] Listening on topic: ${topic}`);
        const listenerStartTime = Date.now();

        /**
         * Transforms the Kafka message data and invokes the handler function.
         * 
         * @param {Object} dataPackage - The Kafka message data.
         * @param {Object} dataPackage.message - The Kafka message object.
         * @param {Object} dataPackage.message.key - The optional key of the message.
         * @param {Object} dataPackage.message.value - The value of the message.
         * @returns {Promise<void>} - A promise indicating that the handler has processed the message.
         */
        async function transformHandler(dataPackage) {
            const { message } = dataPackage
            const { key, value, timestamp, headers } = message

            // Deserialization transformer
            const startTime = Date.now();
            const deserializedKey = deserialize(key, format);
            const deserializedValue = deserialize(value, format);
            logger.info(`[listenMessage] [transformHandler] Deserialization took ${Date.now() - startTime}ms`);
            //

            if (!deserializedValue) {
                logger.warning(`[listenMessage] Skipped message with invalid value`);
                return;
            }

            const pair = {
                key: deserializedKey,
                value: deserializedValue,
                timestamp,
                headers: {
                    correlationId: headers.correlationId.toString(),
                    traceId: headers.traceId.toString(),
                    type: headers.type.toString()
                }
            };

            logger.debug(`[listenMessage] [transformHandler]`, pair)
            logger.info(`[listenMessage] correlationId: ${pair.headers.correlationId}`)
            /**
             * Pair model
             * @param {string} topic - The name of the event to listen for.
             * @param {function({ key: (any|undefined), value: any })} handler - The callback function to handle the message data. The handler
             * 
             */
            await handler(pair);  // Invoke the handler with the transformed data
        }

        // Start listening to the Kafka topic
        await kafkaListener.startListening(topic, transformHandler);

        logger.notice(`[listenMessage] Listener duration -  ${Date.now() - listenerStartTime} ms`);
    } catch (error) {
        logger.error(`[listenMessage] Error while listening to topic ${topic}: ${error.message}`);
    }
}

/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * The producer instance is reused for multiple sends.
 * 
 * @param {string} topic - The topic to which the messages will be sent.
 * @param {Object} pair - The message data object.
 * @param {Object} pair.key - The optional key of the message in JSON format.
 * @param {Object} pair.value - The value of the message in JSON format.
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, { key, value, headers } = {}, format = MESSAGE_FORMATS.JSON) {
    if (!key || !value) {
        logger.error(`[KafkaTransporter] [sendMessage] Invalid message format: missing key or value`);
        return;
    }

    try {

        const serializedKey = serialize(key, format);
        const serializedValue = serialize(value, format);

        const pair = {
            key: serializedKey,
            value: serializedValue,
            headers
        };

        const pairs = [pair];

        await kafkaSender.sendPairs(topic, pairs);

        logger.info(`[sendMessage] Sent message to topic: ${topic}`);
        //logger.notice(`[sendMessage] correlationId: ${pair.headers.correlationId}`)

    } catch (error) {
        logger.error(`[sendMessage] Failed to send message: ${error.message}`);
    }
}

/**
 * Sends multiple binary data (Buffer) messages to a Kafka topic.
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
async function sendMessages(topic, messages = [], format = MESSAGE_FORMATS.JSON) {
    if (!Array.isArray(messages) || messages.length === 0) {
        logger.error(`[KafkaTransporter] [sendMessages] Invalid input: 'messages' should be a non-empty array`);
        return;
    }

    try {

        const pairs = messages.map(({ key, value, headers }) => {
            if (!value) {
                logger.warning(`[KafkaTransporter] [sendMessages] Map - Skipping message with missing value`);
                return null;
            }

            const serializedKey = serialize(key, format);
            const serializedValue = serialize(value, format);

            const pair = {
                key: serializedKey,
                value: serializedValue,
                headers
            };

            return pair;
        }).filter(Boolean); // Remove null entries caused by invalid 

        if (pairs.length === 0) {
            logger.warning(`[KafkaTransporter] [sendMessages] Map - No valid messages to send`, pairs);
            return;
        }

        // Send the transformed messages
        await kafkaSender.sendPairs(topic, pairs);

        logger.info(`[KafkaTransporter] [sendMessages] Sent ${pairs.length} message(s) to topic: ${topic}`, pairs);

    } catch (error) {
        logger.error(`[KafkaTransporter] [sendMessages] [error] ${topic} - ${error.message}`);
    }
}

module.exports = {
    Name: 'KafkaTransporter',
    sendMessage,
    sendMessages,
    listenMessage
};