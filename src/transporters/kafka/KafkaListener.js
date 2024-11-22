const KafkaConsumer = require("./KafkaConsumer")
const logger = require("../../utils/logger")
const config = require("./config")
/**
 * KafkaListener class responsible for consuming messages from a Kafka topic.
 * This class allows subscribing to a topic and processing messages with custom handlers.
 */
class KafkaListener {
  /**
   * Creates an instance of KafkaListener and initializes the Kafka consumer.
   */
  constructor() {
    this.kafkaConsumer = new KafkaConsumer();
  }

  /**
   * Starts listening to a Kafka topic and processes each message with a provided handler.
   * @param {string} topic - The Kafka topic to listen to.
   * @param {Function} handler - The function to process each consumed message. It receives the `dataPackage` as a parameter.
   * @returns {Promise<void>} - Resolves when the consumer starts listening successfully.
   * @throws {Error} - If there is an error during the subscription or message processing.
   * 
   * @example
   * const topic = "example-topic";
   * const handler = (dataPackage) => { 
   *     console.log(dataPackage.message.value.toString()); 
   * };
   * const kafkaListener = new KafkaListener();
   * await kafkaListener.startListening(topic, handler);
   */
  async startListening(topic, handler) {
    if (this.kafkaConsumer.status !== 'CONNECTED') {
      logger.error(`[KafkaListener] [startListening] Consumer is not connected. Current status: ${this.kafkaConsumer.status}`);
      return;
    }

    try {
      await this.kafkaConsumer.trySubscribeWithRetry(topic);
      // Start consuming messages
      const consumerStartTime = Date.now();
      await this.kafkaConsumer.consumer.run({

        /**
         * Processes each consumed message.
         * @param {Object} dataPackage - The consumed message and metadata.
         * @param {string} dataPackage.topic - The topic the message came from.
         * @param {Object} dataPackage.message - The Kafka message.
         * @param {Buffer} dataPackage.message.value - The message value.
         * @param {string} dataPackage.partition - The Kafka partition where the message came from.
         * @param {number} dataPackage.offset - The offset of the consumed message.
         */
        eachMessage: async (dataPackage) => {
          const startTime = Date.now();

          const { topic, message, partition, heartbeat, pause } = dataPackage
          const { attributes, timestamp, offset, key, value, headers, isControlRecord, batchContext } = message

          try {
            logger.debug(`[KafkaListener] [startListening] Processing before handler. topic:"${topic}" partition:"${partition}" offset:"${offset}" timestamp:"${timestamp} key:"${key}" value:"${value}`);
            if (handler) {
              await handler(dataPackage);
            }
            logger.debug(`[KafkaListener] [startListening] Processing after handler duration - ${Date.now() - startTime} ms`);
          } catch (processError) {
            // logger.error(`[KafkaListener] [startListening] [processError] ${processError.message}`);
            throw processError // DLQ : An error occurred now. Restart this task later.
          }
        },

        autoCommit: config.kafkaConfig.autoCommit,
        autoCommitInterval: config.kafkaConfig.autoCommitInterval,
        minBytes: config.kafkaConfig.maxBytes,
        maxBytes: config.kafkaConfig.maxBytes,
        maxWaitTimeInMs: config.kafkaConfig.maxWaitTimeInMs
      });
      logger.debug(`[KafkaListener] [startListening] Consumer duration -  ${Date.now() - consumerStartTime} ms`);
      logger.info(`[KafkaListener] Listening to messages on topic ${topic}`);
    } catch (error) {
      logger.error(`[KafkaListener] [startListening] [error] topic: ${topic}, error message: ${error.message}`);
    }
  }

  /**
   * Stops the Kafka consumer from listening to messages.
   * @returns {Promise<void>} - Resolves when the consumer is stopped successfully.
   */
  async stop() {
    await this.kafkaConsumer.stop();
  }
}

module.exports = KafkaListener;
