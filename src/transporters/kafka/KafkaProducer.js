const { Kafka } = require("kafkajs")
const config = require("./config")
const logger = require("../../utils/logger")
/**
 * KafkaProducer class responsible for sending messages to Kafka topics.
 * Provides functionality to connect, send messages, and manage retries with error handling.
 */
class KafkaProducer {
    /**
     * Creates an instance of KafkaProducer and initializes Kafka connection settings.
     */
    constructor() {
        this.kafka = new Kafka({
            brokers: [config.kafkaConfig.brokers],
            clientId: config.producerConfig.clientId,
            logLevel: config.kafkaConfig.logLevel || 0, // Dynamic log level
        });
        this.producer = this.kafka.producer();
        this.status = 'PENDING';
        logger.debug(`[KafkaProducer] Initializing producer producerId: ${config.producerConfig.clientId}`, { producerId: config.producerConfig.clientId });
    }

    /**
     * Attempts to connect to the Kafka producer with a configurable timeout.
     * @param {Promise} promise - The connection promise to be resolved.
     * @param {number} timeout - The maximum time to wait for the connection, in milliseconds.
     * @returns {Promise} - Resolves if the connection is established, rejects if it times out.
     * @throws {Error} - If the connection times out or fails.
     */
    async connectWithTimeout(promise, timeout) {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Connection timeout: ${timeout} ms`)), timeout)
        );
        return Promise.race([promise, timeoutPromise]);
    }

    /**
     * Connects the Kafka producer to the Kafka cluster.
     * @returns {Promise<void>} - Resolves when the producer successfully connects.
     * @throws {Error} - If the producer fails to connect.
     */
    async connect() {
        try {
            await this.connectWithTimeout(this.producer.connect(), config.kafkaConfig.authenticationTimeout); // Configurable timeout
            this.status = 'CONNECTED';
            logger.debug("[KafkaProducer] Producer connected");
        } catch (error) {
            this.status = 'CONNECTION_ERROR';
            logger.error(`[KafkaProducer] Producer connection error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Sends a single record to the specified Kafka topic.
     * @param {Object} producerRecord - The record to be sent to Kafka.
     * @param {string} producerRecord.topic - The Kafka topic to send the record to.
     * @param {Array} producerRecord.messages - The messages to be sent.
     * @returns {Promise<void>} - Resolves when the record is sent successfully.
     * @throws {Error} - If the message fails to send.
     */
    async sendRecord(producerRecord) {
        try {
            await this.producer.send(producerRecord);
            logger.debug(`[KafkaProducer] producerRecord sent to topic "${producerRecord.topic}"`);
        } catch (error) {
            logger.error(`[KafkaProducer] Failed to send producerRecord. error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Attempts to send a record with retry logic.
     * @param {Object} producerRecord - The record to send.
     * @param {number} [retries=config.kafkaConfig.retries] - The number of retry attempts.
     * @param {number} [delay=config.kafkaConfig.initialRetryTime] - The delay between retries, in milliseconds.
     * @returns {Promise<void>} - Resolves when the record is sent successfully.
     * @throws {Error} - If the message fails to send after the specified number of retries.
     */
    async trySendRecordWithRetry(producerRecord, retries = config.kafkaConfig.retries, delay = config.kafkaConfig.initialRetryTime) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                logger.debug(`[KafkaProducer] Attempt ${attempt} to send producerRecord to topic "${producerRecord.topic}"`);
                await this.sendRecord(producerRecord);
                logger.debug(`[KafkaProducer] Successfully sent record on attempt ${attempt}`);
                return;
            } catch (error) {
                logger.error(`[KafkaProducer] Send error: ${error.message}. Attempt ${attempt}/${retries}`);
                if (attempt < retries) {
                    logger.info(`[KafkaProducer] Retrying in ${delay} ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } else {
                    logger.error(`[KafkaProducer] Failed to send after ${retries} attempts`);
                    throw error;
                }
            }
        }
    }

    /**
     * Disconnects the Kafka producer from the Kafka cluster.
     * @returns {Promise<void>} - Resolves when the producer is disconnected.
     * @throws {Error} - If the producer fails to disconnect.
     */
    async disconnect() {
        try {
            await this.producer.disconnect();
            this.status = 'DISCONNECTED';
            logger.debug("[KafkaProducer] Producer disconnected");
        } catch (error) {
            logger.error(`[KafkaProducer] Failed to disconnect producer: ${error.message}`);
        }
    }
}

module.exports = KafkaProducer;
