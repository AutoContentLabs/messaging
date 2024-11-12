// src/transports/kafka/index.js

const logger = require('../../utils/logger');
const kafkaConfig = require('./config');
const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka(kafkaConfig);

async function createTopicIfNotExists(topic) {
  try {
    const admin = kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();
    if (!topics.includes(topic)) {
      await admin.createTopics({
        topics: [{ topic }],
      });
      logger.info(`Topic ${topic} created`);
    } else {
      logger.info(`Topic ${topic} already exists`);
    }
    await admin.disconnect();
  } catch (error) {
    logger.error(`Error creating topic ${topic}: ${error.message}`);
  }
}

async function startListener(topic, onMessageCallback) {
  try {
    await createTopicIfNotExists(topic);

    const consumer = kafka.consumer({ groupId: kafkaConfig.groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    logger.info(`Listening to Kafka topic "${topic}"...`);

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        onMessageCallback(message.value.toString());
      }
    });
  } catch (error) {
    logger.error(`Error in startListener: ${error.message}`);
  }
}

async function sendMessage(topic, message) {
  try {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    await producer.connect();
    await producer.send({ topic, messages: [{ value: JSON.stringify(message) }] });
    logger.info(`Message sent to Kafka topic "${topic}"`);
    await producer.disconnect();
  } catch (error) {
    logger.error(`Error sending message to ${topic}: ${error.message}`);
  }
}

module.exports = { sendMessage, startListener };
