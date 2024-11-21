const KafkaProducer = require("./KafkaProducer")
const logger = require("../../utils/logger")
const config = require("./config")
const { CompressionTypes } = require("kafkajs");
const { retryWithBackoff } = require("../../utils/retry");

/**
 * KafkaSender is responsible for sending a batch of messages to a specified Kafka topic.
 * It handles message retries, compression, and ensures that messages are sent successfully.
 * 
 * The messages are sent with GZIP compression to minimize network load and ensure efficient message transmission.
 * 
 * @class
 */
class KafkaSender {
    /**
     * Creates an instance of KafkaSender and initializes the KafkaProducer instance.
     * 
     * @constructor
     */
    constructor() {
        this.KafkaProducer = new KafkaProducer(); // KafkaProducer instance is initialized here     
    }

    async connectProducer() {
        // Step 1: Connect the Kafka producer to the Kafka cluster
        logger.debug(`[KafkaSender] [sendPairs] Connecting to Kafka producer...`);

        await retryWithBackoff(() => this.KafkaProducer.connect())
    }

    /**
     * @typedef {Object} KafkaMessage
     * @property {Buffer} [key] - Optional key for the message, used for partitioning in Kafka.
     * @property {Buffer} value - The message value as binary data (Buffer). This field is required.
     */

    /**
     * Sends a batch of messages to a specified Kafka topic with retry capability.
     * 
     * This method connects to Kafka, sends a batch of messages to the provided topic, and ensures that
     * the messages are retried on failure. The messages are sent with GZIP compression to minimize network load.
     * 
     * @param {string} topic - The Kafka topic to which the messages will be sent. This should be a valid Kafka topic name.
     * @param {KafkaMessage[]} pairs - An array of Kafka messages, each containing a binary `value` field (Buffer).
     *                                Optionally, a `key` field can be provided for partitioning the messages.
     *                                Example: [{ key: Buffer.from("key1"), value: Buffer.from("Message 1") }]
     * @returns {Promise<void>} - Resolves when the messages are successfully sent to Kafka.
     *                            Rejects with an error if sending fails.
     * @throws {Error} If the Kafka producer fails to connect, send the messages, or retry after several attempts.
     * 
     * @example
     * const topic = "example-topic";
     * const messages = [
     *     { key: Buffer.from("key1"), value: Buffer.from("Message 1") },
     *     { value: Buffer.from("Message 2") } // Key is optional
     * ];
     * 
     * const kafkaSender = new KafkaSender();
     * await kafkaSender.sendPairs(topic, messages);
     */
    async sendPairs(topic, pairs) {
        try {

            // Step 1
            await this.connectProducer()

            // Step 2: Create the producer record with topic, messages, timeout, and compression settings
            const producerRecord = {
                topic: topic,
                messages: pairs,  // Pairs: An array of Kafka messages (with optional keys and required values)
                timeout: config.kafkaConfig.requestTimeout,  // The maximum wait time for sending messages
                compression: CompressionTypes.GZIP,  // GZIP compression to optimize network usage
            };

            // Step 3: Send the messages with retry logic
            logger.debug(`[KafkaSender] [sendPairs] Attempting to send ${pairs.length} message(s) to topic "${topic}"`);
            await this.KafkaProducer.trySendRecordWithRetry(producerRecord, config.kafkaConfig.retries, config.kafkaConfig.initialRetryTime);

            // Success: Log success message
            logger.debug(`[KafkaSender] [sendPairs] Successfully sent ${pairs.length} message(s) to topic "${topic}"`);

        } catch (error) {
            // Error: Log detailed error message
            logger.error(`[KafkaSender] [sendPairs] Failed to send messages to topic "${topic}". Error: ${error.message}`);
            throw error;  // Rethrow the error for higher-level handling
        } finally {
            // Step 4: Disconnect the producer to clean up the resources
            logger.debug(`[KafkaSender] [sendPairs] Disconnecting Kafka producer...`);
            await this.KafkaProducer.disconnect();
            logger.debug(`[KafkaSender] [sendPairs] Producer disconnected`);
        }
    }
}

module.exports = KafkaSender;
