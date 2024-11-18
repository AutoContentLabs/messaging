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
const { v4: uuidv4 } = require('uuid');
/**
 * Starts the Kafka consumer listener to ensure it is connected and ready.
 * 
 * This function checks the Kafka topics and connects the consumer.
 * 
 * @returns {Promise<void>} - A promise indicating the completion of the listener start-up process.
 */
async function StartListener() {
    try {
        await kafkaAdmin.checkTopics();
        await kafkaListener.kafkaConsumer.connect();
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
async function listenMessage(topic, handler) {

    try {

        if (typeof handler !== 'function') {
            throw new Error('Provided handler is not a function');
        }

        await StartListener();

        logger.info(`[KafkaTransporter] [listenMessage] starting listening...: ${topic}`);
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

            // transformer
            const deserializedKey = deserialize(key);
            const deserializedValue = deserialize(value);

            if (!deserializedKey) {
                logger.warning(`[KafkaTransporter] [transformHandler] Invalid 'key' for topic: ${dataPackage.topic}`, dataPackage);
            }
            if (!deserializedValue) {
                logger.warning(`[KafkaTransporter] [transformHandler] Invalid 'value' for topic: ${dataPackage.topic}`, dataPackage);
                return; // we do not process worthless message
            }

            const pair = {
                key: deserializedKey,
                value: deserializedValue,
                timestamp,
                headers: {
                    correlationId: headers.correlationId.toString(),
                    traceId: headers.traceId.toString()
                }
            }

            logger.debug(`[KafkaTransporter] [listenMessage] [transformHandler]`, pair)
            
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

        logger.notice(`[KafkaTransporter] [listenMessage] Listener duration -  ${Date.now() - listenerStartTime} ms`);
    } catch (error) {
        logger.error(`[KafkaTransporter] [listenMessage] [error] topic: ${topic}, error message: ${error.message}`);
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
async function sendMessage(topic, { key, value } = {}, useBuffer = true) {
    if (!key || !value) {
        logger.error(`[KafkaTransporter] [sendMessage] Invalid message format: missing key or value`);
        return;
    }

    try {

        // for standard ( JSON, String ) 
        const jsonSerializedKey = serialize(key, MESSAGE_FORMATS.JSON);
        const jsonSerializedValue = serialize(value, MESSAGE_FORMATS.JSON);

        // for performance (gzip, Avro, Protobuf)
        // we will use for data schema and model
        const bufferSerializedKey = serialize(key, MESSAGE_FORMATS.BUFFER);
        const bufferSerializedValue = serialize(value, MESSAGE_FORMATS.BUFFER);

        const pair = {
            key: jsonSerializedKey,
            value: jsonSerializedValue,
            // timestamp: is default adding automatically. if need any time you can set
            headers: {
                correlationId: uuidv4().toString(),
                traceId: uuidv4().toString()
            }
        }

        const pairs = [pair];

        await kafkaSender.sendPairs(topic, pairs);

        logger.debug(`[KafkaTransporter] [sendMessage] Sent ${pairs.length} message(s) to topic: ${topic}`, pairs);
    } catch (error) {
        logger.error(`[KafkaTransporter] [sendMessage] [error] ${topic} - ${error.message}`, pairs);
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
async function sendMessages(topic, messages = []) {
    if (!Array.isArray(messages) || messages.length === 0) {
        logger.error(`[KafkaTransporter] [sendMessages] Invalid input: 'messages' should be a non-empty array`);
        return;
    }

    try {

        const pairs = messages.map(({ key, value }) => {
            if (!value) {
                logger.warning(`[KafkaTransporter] [sendMessages] Map - Skipping message with missing value`);
                return null;
            }

            // for standard ( JSON, String ) 
            const jsonSerializedKey = serialize(key, MESSAGE_FORMATS.JSON);
            const jsonSerializedValue = serialize(value, MESSAGE_FORMATS.JSON);

            // for performance (gzip, Avro, Protobuf)
            // we will use for data schema and model
            const bufferSerializedKey = serialize(key, MESSAGE_FORMATS.BUFFER);
            const bufferSerializedValue = serialize(value, MESSAGE_FORMATS.BUFFER);

            const pair = {
                key: jsonSerializedKey,
                value: jsonSerializedValue,
                // timestamp: is default adding automatically. if need any time you can set
                headers: {
                    correlationId: uuidv4().toString(),
                    traceId: uuidv4().toString()
                }
            }

            return transform;
        }).filter(Boolean); // Remove null entries caused by invalid 

        if (pairs.length === 0) {
            logger.warning(`[KafkaTransporter] [sendMessages] Map - No valid messages to send`, pairs);
            return;
        }

        // Send the transformed messages
        await kafkaSender.sendPairs(topic, pairs);

        logger.notice(`[KafkaTransporter] [sendMessages] Sent ${pairs.length} message(s) to topic: ${topic}`, pairs);
    } catch (error) {
        logger.error(`[KafkaTransporter] [sendMessages] [error] ${topic} - ${error.message}`, pairs);
    }
}

module.exports = {
    Name: 'KafkaTransporter',
    sendMessage,
    sendMessages,
    listenMessage
};