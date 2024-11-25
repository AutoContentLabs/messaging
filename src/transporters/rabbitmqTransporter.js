// src/transporters/rabbitmqTransporter.js

const RabbitMQSender = require("./rabbitmq/RabbitMQSender");
const RabbitMQListener = require("./rabbitmq/RabbitMQListener");

let rabbitMQSenderInstance = null;
let rabbitMQListenerInstance = null;

const createRabbitMQSender = (eventName) => {
  if (!rabbitMQSenderInstance) {
    rabbitMQSenderInstance = new RabbitMQSender(eventName);
  }
  return rabbitMQSenderInstance;
};

const createRabbitMQListener = (eventName) => {
  if (!rabbitMQListenerInstance) {
    rabbitMQListenerInstance = new RabbitMQListener(eventName);
  }
  return rabbitMQListenerInstance;
};

const sendMessage = async (eventName, pair) => {
  try {
    const rabbitMQSender = createRabbitMQSender(eventName);
    await rabbitMQSender.sendMessage(pair);
  } catch (error) {
    console.error(`Error sending message on ${eventName}:`, error);
  }
};

const sendMessages = async (eventName, pairs) => {
  try {
    const rabbitMQSender = createRabbitMQSender(eventName);
    await rabbitMQSender.sendMessages(pairs);
  } catch (error) {
    console.error(`Error sending message on ${eventName}:`, error);
  }
};

const listenMessage = async (eventName, handler) => {
  try {
    const rabbitMQListener = createRabbitMQListener(eventName);
    await rabbitMQListener.start(handler);
  } catch (error) {
    console.error(`Error starting listener for ${eventName}:`, error);
  }
};

module.exports = {
  Name: 'RabbitMQ',
  sendMessage,
  sendMessages,
  listenMessage,
};
