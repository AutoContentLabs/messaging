// src/transports/config.js

const topics = require("./topics");
const kafkaConfig = require("./kafka/config")
module.exports = {
    transport: process.env.MESSAGE_SYSTEM || 'kafka',
    systems: {
        kafka: kafkaConfig
    },
    topics: topics
};
