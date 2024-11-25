const RabbitMQSender = require("./rabbitmq/RabbitMQSender");
const RabbitMQListener = require("./rabbitMQListener");

const rabbitMQSenderInstance = {};
const rabbitMQListenerInstance = {};

const createRabbitMQSender = (eventName) => {
  if (!rabbitMQSenderInstance[eventName]) {
    rabbitMQSenderInstance[eventName] = new RabbitMQSender({ eventName });
  }
  return rabbitMQSenderInstance[eventName];
};

const createRabbitMQListener = (eventName) => {
  if (!rabbitMQListenerInstance[eventName]) {
    rabbitMQListenerInstance[eventName] = new RabbitMQListener({ eventName });
  }
  return rabbitMQListenerInstance[eventName];
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
    console.error(`Error sending messages on ${eventName}:`, error);
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
