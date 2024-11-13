// src/transports/kafka/index.js

const logger = require('../../utils/logger'); // Logger utility
const { kafkaConfig, config } = require('./config'); // Kafka configuration file
const { Kafka, Partitioners } = require('kafkajs'); // KafkaJS library

// Kafka client instance (only one instance should be created)
const kafka = new Kafka(kafkaConfig);
const admin = kafka.admin();
const consumer = kafka.consumer({ groupId: config.KAFKA_GROUP_ID });
const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

process.on('SIGINT', async () => {
  try {
    // Kafka consumer bağlantısını kapatmadan önce işlemleri tamamla
    await consumer.disconnect();
    logger.info("Kafka consumer disconnected successfully");

    // Producer bağlantısını sonlandır
    await producer.disconnect();
    logger.info("Kafka producer disconnected successfully");

    // Admin bağlantısını sonlandır
    await admin.disconnect();
    logger.info("Kafka admin disconnected successfully");

  } catch (error) {
    logger.error(`Error during shutdown: ${error.message}`);
  } finally {
    console.log("Application shutting down...");
    process.exit(0); // Uygulamanın kapanmasını sağla
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
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
      logger.info(`Topic [${topic}] created successfully.`);
    } else {
      logger.info(`Topic [${topic}] already exists.`);
    }
  } catch (error) {
    logger.error(`Error creating topic ${topic}: ${error.message}`);
  } finally {
    await admin.disconnect(); // Ensure disconnect after admin operations
  }
}

/**
 * Starts a Kafka consumer to listen to a given topic and process messages.
 * 
 * @param {string} topic - The Kafka topic to listen to.
 * @param {Function} onMessage - The callback function to process each message.
 * @returns {Promise<void>} - A promise indicating the completion of the consumer setup.
 */
async function startListener(topic, onMessage) {
  await createTopicIfNotExists(topic);

  try {
    await consumer.connect(); // Connect to Kafka
    await consumer.subscribe({ topic, fromBeginning: true }); // Subscribe to the topic
    logger.info(`Starting listener on topic [${topic}]...`);

    const consumerStartTime = Date.now();
    await consumer.run({
      eachMessage: async (messageArray) => {
        const startTime = Date.now();
        try {
          // Process the message (for now logging it)
          logger.info(`Message processed in ${Date.now() - startTime} ms`);
          // Call your message processing function here
          if (onMessage) {
            await onMessage(messageArray);
          }
        } catch (processError) {
          logger.error(`Error processing message: ${processError.message}`);
        }
      },
      autoCommit: true, // Prevent auto commit of messages
      autoCommitInterval: 10000,
      minBytes: 1,
      maxBytes: 1024,
      maxWaitTimeInMs: 500,
    });

    logger.info(`Consumer is running and processing messages. ${Date.now() - consumerStartTime} ms`);
  } catch (error) {
    logger.error(`Error in startListener for topic ${topic}: ${error.message}`);
  } finally {
    try {
      // await consumer.disconnect(); // Ensure the consumer disconnects after finishing
    } catch (error) {
      logger.error(`Error during consumer disconnect: ${error.message}`);
    }
  }
}


/**
 * Sends binary data (Buffer) messages to a Kafka topic.
 * 
 * @param {string} topic - The Kafka topic to which the messages will be sent.
 * @param {Array<{ key?: Buffer, value: Buffer }>} messagesArray - An array of messages, each containing binary data (Buffer) in the value field, and optionally a key field.
 * @returns {Promise<void>} - A promise indicating the completion of the message send operation.
 */
async function sendMessage(topic, messagesArray) {


  if (!Array.isArray(messagesArray) || messagesArray.length === 0) {
    logger.warn("No messages to send. Message array is empty or invalid.");
    return;
  }

  try {
    await producer.connect(); // Connect to the Kafka producer

    // Send the valid binary messages to the topic
    await producer.send({
      topic,
      messages: messagesArray,
      timeout: 500,
      compression: Kafka.CompressionTypes.GZIP,
    });

    logger.info(`Sent ${messagesArray.length} message(s) to Kafka topic "${topic}"`);
  } catch (error) {
    logger.error(`Error sending message(s) to ${topic}: ${error.message}`);
  } finally {
    await producer.disconnect(); // Ensure the producer always disconnects
  }
}

module.exports = { kafka, sendMessage, startListener }; // Exporting functions for use in other modules
