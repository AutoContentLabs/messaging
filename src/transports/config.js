// src/transports/config.js

// Import necessary modules for topics and transport configurations
const topics = require("./topics"); // Topics for Kafka or other transports
const kafkaConfig = require("./kafka/config"); // Kafka configuration

// Optional imports for future transport systems
// const rabbitmqConfig = require('./rabbitmq/config'); // RabbitMQ configuration
// const redisConfig = require('./redis/config'); // Redis configuration

module.exports = {
    /**
     * Defines the transport system based on environment variables
     * with a default fallback to 'kafka' if not specified.
     */
    transport: process.env.MESSAGE_SYSTEM || 'kafka',

    /**
     * Systems object to handle multiple transports in the future.
     * Each transport configuration should be structured to include
     * essential parameters for seamless addition and management.
     */
    systems: {
        kafka: kafkaConfig,
        // Future transport systems (uncomment as needed):
        // rabbitmq: rabbitmqConfig,
        // redis: redisConfig,
    },

    /**
     * Topics configuration to support a scalable topic management system.
     * This can be modified to manage topics dynamically based on the chosen transport.
     */
    topics: topics || { 
        default: 'default_topic' // Fallback topic if no topics are defined
    },

    /**
     * Helper function to retrieve specific system configurations dynamically.
     * This allows flexibility for future transport integrations.
     * 
     * @param {string} systemName - Name of the messaging system (e.g., 'kafka', 'rabbitmq').
     * @returns {object|null} - Returns configuration object for the specified system or null if not found.
     */
    getSystemConfig(systemName) {
        return this.systems[systemName] || null;
    }
};
