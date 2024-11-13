// src/transports/index.js

const config = require("./config");  // Configuration for transport systems
const topics = require("./topics");  // Topics definitions for various transports
const kafka = require("./kafka");  // Kafka transport implementation

// Aggregate all available transport systems into a single object
const systems = {
    kafka,  // Kafka as default transport
    // Future transports can be added here, e.g., RabbitMQ, Redis
    // rabbitmq: require("./rabbitmq"),
    // redis: require("./redis"),
};

// Function to get the specified transport system based on configuration
const getTransportSystem = () => {
    const transportType = config.transport;
    
    if (!systems[transportType]) {
        throw new Error(`Transport system "${transportType}" is not supported.`);
    }

    return systems[transportType];
};

// Exporting as default for cleaner imports in other modules
module.exports = { systems, config, topics, getTransportSystem };
