// src/transports/kafka/index.js

const logger = require('../../utils/logger');  // Logger utility
const kafkaConfig = require('./config');  // Kafka configuration file
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
      logger.info(`Topic ${topic} created successfully.`);
    } else {
      logger.info(`Topic ${topic} already exists.`);
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
 * @param {Function} onMessageCallback - The callback function to process each message.
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function startListener(topic, onMessageCallback) {
  try {
    // Ensure the topic exists before starting the listener
    await createTopicIfNotExists(topic);

    const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });
    await consumer.connect();  // Connect to the Kafka consumer
    await consumer.subscribe({ topic, fromBeginning: true });  // Subscribe to the topic from the beginning

    logger.info(`Listening to Kafka topic "${topic}"...`);

    // Start processing messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        onMessageCallback(topic, partition, message);  // Call the callback with message data
      },
    });
  } catch (error) {
    logger.error(`Error in startListener: ${error.message}`);
  }
}

/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * 
 * @param {string} topic - The Kafka topic to which the messages will be sent.
 * @param {Buffer[]} messages - An array of messages, each containing binary data (Buffer).
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, messages) {
  try {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await producer.connect();  // Connect to the Kafka producer

    // Send the binary messages to the topic
    await producer.send({
      topic: topic,
      messages: messages.map((msg) => ({
        value: msg,  // Each message is a Buffer (binary data)
      })),
    });

    logger.info(`Message sent to Kafka topic "${topic}"`);
    await producer.disconnect();  // Disconnect the producer after sending the message
  } catch (error) {
    logger.error(`Error sending message to ${topic}: ${error.message}`);
  }
}

module.exports = { kafka, sendMessage, startListener };  // Exporting functions for use in other modules
