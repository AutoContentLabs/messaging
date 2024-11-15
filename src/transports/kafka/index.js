/**
 * src\transports\kafka\index.js
 */
const logger = require('../../utils/logger'); // Logger utility
const { kafkaConfig, config } = require('./config'); // Kafka configuration file
const { Kafka, Partitioners, CompressionTypes } = require('kafkajs'); // KafkaJS library

// Kafka client instance (only one instance should be created)
const kafka = new Kafka(kafkaConfig);
const admin = kafka.admin();
const consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

// Clean shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  try {
    // Kafka consumer connection
    if (consumer) {
      await consumer.disconnect();
      logger.debug(`[SIGINT] [consumer] disconnected`);
    }

    // Producer connection
    if (producer) {
      await producer.disconnect();
      logger.debug(`[SIGINT] [producer] disconnected`);
    }

    // Admin connection
    if (admin) {
      await admin.disconnect();
      logger.debug(`[SIGINT] [admin] disconnected`);
    }
  } catch (error) {
    logger.error(`[SIGINT] [shutdown] [error] ${error.message}`);
  } finally {
    logger.info(`[SIGINT] [shutdown] Application shutting down...`);
    process.exit(0); // Gracefully shutdown the application
  }
});

/**
 * Creates a Kafka topic if it does not already exist.
 * 
 * @param {string} topic - The Kafka topic to check or create.
 * @returns {Promise<void>} - A promise indicating the completion of topic creation or existence check.
 */
async function createTopicIfNotExists(topic) {
  try {
    await admin.connect(); // Connect to Kafka admin
    const topics = await admin.listTopics(); // List existing topics
    if (!topics.includes(topic)) {
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions: config.KAFKA_NUM_PARTITIONS,
            replicationFactor: config.KAFKA_REPLICATION_FACTOR
          },
        ],
      });
      logger.debug(`[TOPIC] [create] Topic created: ${topic}`);
    } else {
      logger.debug(`[TOPIC] [exists] Topic already exists: ${topic}`);
    }
  } catch (error) {
    logger.error(`[TOPIC] [create] [error] ${topic} - ${error.message}`);
  } finally {
    await admin.disconnect(); // Ensure disconnect after admin operations
  }
}

/**
 * Starts a Kafka consumer to listen to a given topic and process messages.
 * This consumer can be reused for multiple topics without creating new instances.
 * 
 * @param {string} topic - The Kafka topic to listen to.
 * @param {Function} onMessage - The callback function to process each message.
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function startListener(topic, onMessage) {
  try {
    await createTopicIfNotExists(topic);

    // Only connect once to the consumer
    if (!consumer._connected) {
      await consumer.connect(); // Connect to Kafka if not already connected
    }

    await consumer.subscribe({ topic, fromBeginning: true }); // Subscribe to the topic
    logger.info(`[LISTENER] [subscribe] Subscribed to topic: ${topic}`);

    const consumerStartTime = Date.now();
    // if consumer running true ?
    await consumer.run({
      eachMessage: async (item) => {
        const startTime = Date.now();
        try {
          logger.debug(`[LISTENER] [eachMessage] Processing message - ${JSON.stringify(item)}`);
          if (onMessage) {
            await onMessage(item);
          }
          logger.debug(`[LISTENER] [eachMessage] Message processed in ${Date.now() - startTime} ms`);
        } catch (processError) {
          logger.error(`[LISTENER] [eachMessage] [processError] ${processError.message}`);
        }
      },
      autoCommit: true, // Prevent auto commit of messages
      autoCommitInterval: 10000,
      minBytes: 1,
      maxBytes: 1024,
      maxWaitTimeInMs: 500,
    });

    logger.debug(`[LISTENER] [consumer.run] Consumer started in ${Date.now() - consumerStartTime} ms`);
  } catch (error) {
    logger.error(`[LISTENER] [Error] [topic: ${topic}] ${error.message}`);
  }
}

/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * The producer instance is reused for multiple sends.
 * 
 * @param {string} topic - The Kafka topic to which the messages will be sent.
 * @param {Array<{ key?: Buffer, value: Buffer }>} messagesArray - An array of messages, each containing binary data (Buffer) in the value field, and optionally a key field.
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, messagesArray) {
  if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
    logger.warn(`[SEND] [check] No messages to send. Message array is empty or invalid.`);
    return;
  }

  try {
    // Only connect once to the producer
    if (!producer._connected) {
      await producer.connect(); // Connect to Kafka producer if not already connected
    }

    // Send the valid binary messages to the topic
    await producer.send({
      topic,
      messages: messagesArray,
      timeout: 500,
      compression: CompressionTypes.GZIP,
    });

    logger.debug(`[SEND] [message] Sent ${messagesArray.length} message(s) to topic: ${topic}`);
  } catch (error) {
    logger.error(`[SEND] [message] [error] ${topic} - ${error.message}`);
  }
}

module.exports = { kafka, sendMessage, startListener }; // Exporting functions for use in other modules
