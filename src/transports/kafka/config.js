// src/transports/kafka/config.js

const environment = process.env.NODE_ENV || "development";

// Helper function to handle default values and logging
const getEnvVar = (key, defaultValue, isRequired = false) => {
    const value = process.env[key] || defaultValue;
    if (isRequired && !value) {
        console.error(`Required environment variable ${key} is missing.`);
        process.exit(1); // Exit the application if a required variable is missing
    }
    return value;
};

// Fetch Kafka configuration from environment or use defaults
const brokers = getEnvVar("KAFKA_BROKERS", "localhost:9092");
const clientId = getEnvVar("KAFKA_CLIENT_ID", `data_collector_client.${environment}`);
const groupId = getEnvVar("KAFKA_GROUP_ID", `data_collector_group.${environment}`);
const logLevel = parseInt(getEnvVar("KAFKA_LOG_LEVEL", "0"), 10);

// Validate Kafka log level
if (isNaN(logLevel) || logLevel < 0 || logLevel > 7) {
    console.warn(`Invalid KAFKA_LOG_LEVEL value. Falling back to default log level: 0`);
    logLevel = 0; // Default log level
}

const config = {
    KAFKA_BROKERS: brokers.split(","),
    KAFKA_CLIENT_ID: clientId,
    KAFKA_GROUP_ID: groupId,
    KAFKA_LOG_LEVEL: logLevel,
};

// Kafka configuration object to be passed to Kafka client
const kafkaConfig = {
    brokers: config.KAFKA_BROKERS,
    clientId: config.KAFKA_CLIENT_ID,
    logLevel: config.KAFKA_LOG_LEVEL,
    retry: { initialRetryTime: 1000, retries: 10 },
    requestTimeout: 60000,
    metadataMaxAge: 60000,
};

module.exports = { kafkaConfig, config };
