// src/transports/kafka/index.js

const logger = require('../../utils/logger');  // Logger utility
const { kafkaConfig, config } = require('./config');  // Kafka configuration file
const { Kafka, Partitioners } = require('kafkajs');  // KafkaJS library

// Kafka client instance (only one instance should be created)
const kafka = new Kafka(kafkaConfig);

/**
 * Creates a Kafka topic if it does not already exist.
 * 
 * @param {string} topic - The Kafka topic to check or create.
 * @returns {Promise<void>} - A promise indicating the completion of topic creation or existence check.
 */
async function createTopicIfNotExists(topic) {
  try {
    const admin = kafka.admin();
    await admin.connect();  // Connect to Kafka admin

    const topics = await admin.listTopics();  // List existing topics
    if (!topics.includes(topic)) {
      // If topic doesn't exist, create it
      await admin.createTopics({
        topics: [
          {
            topic,
            numPartitions: 1,  // Number of partitions (default: 1)
            replicationFactor: 1,  // Replication factor (default: 1, higher for fault tolerance)
          },
        ],
      });
      logger.info(`Topic [${topic}] created successfully.`);
    } else {
      logger.info(`Topic [${topic}] already exists.`);
    }

    await admin.disconnect();  // Disconnect from Kafka admin
  } catch (error) {
    logger.error(`Error creating topic ${topic}: ${error.message}`);
  }
}

/**
 * Starts a Kafka consumer to listen to a given topic and process messages.
 * 
 * @param {string} topic - The Kafka topic to listen to.
 * @param {Function} onMessage - The callback function to process each message.
 *        The callback should have the following signature:
 *        `onMessage(topic: string, partition: number, message: { key: Buffer, value: Buffer, timestamp: string, offset: string })`
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function startListener(topic, onMessage) {
  try {
    // Ensure the topic exists before starting the listener
    await createTopicIfNotExists(topic);

    const consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID });
    await consumer.connect();  // Connect to the Kafka consumer
    await consumer.subscribe({ topic, fromBeginning: true });  // Subscribe to the topic from the beginning

    logger.info(`Starting... [${topic}]`);

    // Start processing messages
    await consumer.run({
      eachMessage: onMessage
    });
  } catch (error) {
    logger.error(`Error in startListener: ${error.message}`);
  }
}

/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * 
 * @param {string} topic - The Kafka topic to which the messages will be sent.
 * @param {Array<{ key?: Buffer, value: Buffer }>} messagesArray - An array of messages, each containing binary data (Buffer) in the value field, and optionally a key field.
 * The message structure is compatible with `startListener` consumption requirements.
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, messagesArray) {
  const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

  try {
    await producer.connect();  // Connect to the Kafka producer

    // Validate and prepare the messages
    const validMessages = messagesArray;

    // Send the valid binary messages to the topic
    await producer.send({
      topic: topic,
      messages: validMessages
    });

    // logger.info(`Sent ${validMessages.length} valid message(s) to Kafka topic "${topic}"`);

  } catch (error) {
    logger.error(`Error sending message(s) to ${topic}: ${error.message}`);
  } finally {
    await producer.disconnect();  // Ensure the producer always disconnects
  }
}

module.exports = { kafka, sendMessage, startListener };  // Exporting functions for use in other modules
