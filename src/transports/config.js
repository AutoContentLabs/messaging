// src/transports/config.js

// Import necessary modules for topics and transport configurations
const topics = require("./topics");  // Topics for Kafka or other transports
const kafkaConfig = require("./kafka/config");  // Kafka configuration

module.exports = {
    // Define the transport system (defaulting to 'kafka' if the environment variable is not set)
    transport: process.env.MESSAGE_SYSTEM || 'kafka',

    // Systems object to handle multiple transports in the future
    systems: {
        kafka: kafkaConfig,  // Kafka configuration for Kafka transport
        // Other transports can be added here in the future, e.g., rabbitmq, redis
        // rabbitmq: rabbitmqConfig,
    },

    // Topics configuration
    topics: topics,  // Topics for Kafka (or any other transport in the future)
};
