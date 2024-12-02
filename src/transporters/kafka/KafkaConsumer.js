const logger = require("../../utils/logger")
const config = require("./config")
const { Kafka } = require("kafkajs")
/**
 * KafkaConsumer handles consuming messages from a Kafka topic. It connects to the Kafka cluster, subscribes to topics, and
 * consumes messages. It also includes retry logic for connection and subscription attempts.
 * 
 * @class
 */
class KafkaConsumer {
  /**
   * Creates an instance of KafkaConsumer.
   * Initializes the Kafka client and consumer.
   * 
   * @constructor
   */
  constructor() {
    this.kafka = null;
    this.consumer = null;
    this.status = 'PENDING';
  }

  /**
   * Connects to a given promise with a timeout. If the promise doesn't resolve within the given time, it rejects with a timeout error.
   * 
   * @param {Promise} promise - The promise to race against the timeout.
   * @param {number} timeout - The timeout duration in milliseconds.
   * @returns {Promise} - Resolves with the result of the promise or rejects with a timeout error.
   * 
   * @throws {Error} If the timeout is reached before the promise resolves.
   */
  async connectWithTimeout(promise, timeout) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Connection timeout: ${timeout} ms`)), timeout)
    );
    return Promise.race([promise, timeoutPromise]);
  }

  /**
   * Connects the Kafka consumer to the Kafka cluster.
   * Initializes the Kafka client and consumer instance, and connects to the Kafka brokers.
   * The connection is subject to a configurable timeout.
   * 
   * @returns {Promise<void>} - Resolves when the consumer is successfully connected.
   *                            Rejects if there is an error during connection.
   * 
   * @throws {Error} If the connection fails or times out.
   */
  async connect() {
    try {
      // Initialize Kafka client
      this.kafka = new Kafka({
        brokers: [config.kafkaConfig.brokers],
        clientId: config.consumerConfig.clientId,
        logLevel: config.kafkaConfig.logLevel || 0, // Dynamic log level
      });
      this.status = 'CONFIGURING';
      logger.debug(`[Kafka] configuring... ${config.consumerConfig.clientId} ${config.kafkaConfig.brokers}`);

      // Initialize consumer
      this.consumer = this.kafka.consumer({
        groupId: config.consumerConfig.groupId,
        allowAutoTopicCreation: true,
      });
      this.status = 'PENDING';
      logger.debug(`[Kafka] Initializing consumer... ${config.consumerConfig.groupId}`);

      // Attempt to connect with timeout
      await this.connectWithTimeout(this.consumer.connect(), config.kafkaConfig.authenticationTimeout);
      this.status = 'CONNECTED';
      logger.info(`[Kafka] Consumer connected`);

    } catch (error) {
      this.status = 'CONNECTION_ERROR';
      logger.error(`[Kafka] Consumer connection error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Subscribes to a Kafka topic with retry logic. It attempts to subscribe up to a given number of retries and with a delay
   * between each retry.
   * 
   * @param {string} topic - The Kafka topic to subscribe to.
   * @param {number} [retries=config.kafkaConfig.retries] - The number of retries before giving up on subscribing.
   * @param {number} [delay=config.kafkaConfig.initialRetryTime] - The delay between retry attempts in milliseconds.
   * @returns {Promise<void>} - Resolves when the consumer successfully subscribes to the topic.
   *                            Rejects if the subscription fails after all retries.
   * 
   * @throws {Error} If subscription fails after the specified number of retries.
   */
  async trySubscribeWithRetry(topic, retries = config.kafkaConfig.retries, delay = config.kafkaConfig.initialRetryTime) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        logger.info(`[Kafka] Subscribed to topic: ${topic}`);
        return;
      } catch (error) {
        logger.error(`[Kafka] Subscription error: ${error.message}. Topic: ${topic}, Attempt ${attempt}/${retries}`);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          logger.error(`[Kafka] Failed to subscribe after ${retries} attempts`);
          throw error;
        }
      }
    }
  }

  /**
   * Stops the Kafka consumer by disconnecting it from the Kafka cluster.
   * 
   * @returns {Promise<void>} - Resolves when the consumer is successfully disconnected.
   * 
   * @throws {Error} If the disconnection fails.
   */
  async stop() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.status = 'DISCONNECTED';
      logger.info(`[Kafka] Consumer disconnected`);
    }
  }
}

module.exports = KafkaConsumer;
