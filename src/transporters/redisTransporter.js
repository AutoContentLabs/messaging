// src/transporters/redisTransporter.js

const RedisSender = require("./redis/RedisSender");
const RedisListener = require("./redis/RedisListener");

let redisSenderInstance = null;
let redisListenerInstance = null;

const createRedisSender = (eventName) => {
  if (!redisSenderInstance) {
    redisSenderInstance = new RedisSender({ eventName });
  }
  return redisSenderInstance;
};

const createRedisListener = (eventName) => {
  if (!redisListenerInstance) {
    redisListenerInstance = new RedisListener({ eventName });
  }
  return redisListenerInstance;
};

const sendMessage = async (eventName, pair) => {
  try {
    const redisSender = createRedisSender(eventName);
    await redisSender.send(pair);
  } catch (error) {
    console.error(`Error sending message on ${eventName}:`, error);
  }
};

const sendMessages = async (eventName, pairs) => {
  try {
    const redisSender = createRedisSender(eventName);
    await redisSender.sender(pairs);
  } catch (error) {
    console.error(`Error sending message on ${eventName}:`, error);
  }
};

const listenMessage = async (eventName, handler) => {
  try {
    const redisListener = createRedisListener(eventName);
    await redisListener.start(handler);
  } catch (error) {
    console.error(`Error starting listener for ${eventName}:`, error);
  }
};

module.exports = {
  Name: 'Redis',
  sendMessage,
  sendMessages,
  listenMessage,
};
