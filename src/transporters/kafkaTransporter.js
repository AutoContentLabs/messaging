const logger = require("../utils/logger")
const kafkaConfig = require("./kafka/kafkaConfig")
const { init, producer, compressionType, consumer } = require("./kafka/kafkaClient")

init(kafkaConfig)

/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * The producer instance is reused for multiple sends.
 * 
 * @param {string} topic - The topic to which the messages will be sent.
 * @param {Array<{ key?: Buffer, value: Buffer }>} pairs - An array of messages, each containing binary data (Buffer) in the value field, and optionally a key field.
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, pairs) {
    if (!Array.isArray(pairs) || pairs.length === 0) {
        logger.warn(`[SEND] [check] No messages to send. Message array is empty or invalid.`);
        return;
    }

    try {
        // Only connect once to the producer
        if (!producer._connected) {
            await producer.connect(); // Connect to Kafka producer if not already connected
            // Cannot read properties ?
            // producer._connected = true
        }

        // Send the valid binary messages to the topic
        const producerRecord = {
            topic,
            messages: pairs,
            timeout: kafkaConfig.requestTimeout,
            compression: compressionType,
        }
        await producer.send(producerRecord);

        logger.debug(`[SEND] [message] Sent ${messagesArray.length} message(s) to topic: ${topic}`);
    } catch (error) {
        logger.error(`[SEND] [message] [error] ${topic} - ${error.message}`);
    }
}

/**
 * Starts a consumer to listen to a given topic and process messages.
 * This consumer can be reused for multiple topics without creating new instances.
 * 
 * @param {string} topic - The topic to listen to.
 * @param {Function} handler - The callback function to process each message.
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function listenMessage(topic, handler) {
    try {

        // Only connect once to the consumer
        if (!consumer._connected) {
            await consumer.connect(); // Connect to Kafka if not already connected

            // Cannot read properties ?
            // consumer._connected = true
        }

        await consumer.subscribe({ topic, fromBeginning: true }); // Subscribe to the topic
        logger.info(`[Transporter] [listenMessage] Subscribed to topic: ${topic}`);

        const consumerStartTime = Date.now();
        // if consumer running true ?
        await consumer.run({
            eachMessage: async (dataPackage) => {
                const startTime = Date.now();
                try {
                    logger.debug(`[Transporter] [listenMessage] Processing item - ${JSON.stringify(dataPackage)}`);
                    if (handler) {
                        await handler(dataPackage);
                    }
                    logger.debug(`[Transporter] [listenMessage] Processing duration - ${Date.now() - startTime} ms`);
                } catch (processError) {
                    logger.error(`[Transporter] [listenMessage] [processError] ${processError.message}`);
                }
            },
            autoCommit: kafkaConfig.autoCommit,
            autoCommitInterval: kafkaConfig.autoCommitInterval,
            minBytes: kafkaConfig.minBytes,
            maxBytes: kafkaConfig.maxBytes,
            maxWaitTimeInMs: kafkaConfig.maxWaitTimeInMs
        });

        logger.debug(`[Transporter] [listenMessage] Consumer duration -  ${Date.now() - consumerStartTime} ms`);
    } catch (error) {
        logger.error(`[Transporter] [listenMessage] [error] topic: ${topic}, error message: ${error.message}`);
    }
}

module.exports = {
    Name: 'KafkaTransporter',
    sendMessage,
    listenMessage
}