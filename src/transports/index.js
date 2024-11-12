// src/transports/index.js

const config = require("./config");  // Configuration specific to Kafka transport
const topics = require("./topics");  // Topic definitions for Kafka or other transports
const kafka = require("./kafka");  // Kafka transport system

// Aggregate all transport systems into a 'systems' object
// This will help you scale in case you need to add other transport systems like Redis, RabbitMQ, etc.
const systems = {
    kafka,  // Currently, only Kafka is being used
};

// You can optionally use default export to make imports cleaner
module.exports = { systems, config, topics };
