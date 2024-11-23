// src/transporters/redisTransporter.js

const sendMessage = async (eventName, pair) => {
  const RedisSender = require("./redis/RedisSender")
  const sender = new RedisSender(eventName, "group")
  sender.send(pair)
};

const listenMessage = async (eventName, handler) => {
  const RedisListener = require("./redis/RedisListener")
  const listener = new RedisListener(eventName, "group")
  listener.start(handler)
};

module.exports = {
  Name: 'Redis',
  sendMessage,
  listenMessage,
};
