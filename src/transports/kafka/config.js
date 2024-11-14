const environment = process.env.NODE_ENV || "development";

// Constants for retry and timeout settings to improve readability and maintainability
const DEFAULT_INITIAL_RETRY_TIME = 1000;
const DEFAULT_RETRIES = 10;
const DEFAULT_REQUEST_TIMEOUT = 60000;
const DEFAULT_METADATA_MAX_AGE = 60000;

// Helper function to handle default values and logging
const getEnvVar = (key, defaultValue, isRequired = false) => {
    const value = process.env[key] || defaultValue;
    if (isRequired && !value) {
        console.error(`ERROR: Required environment variable ${key} is missing.`);
        process.exit(1); // Exit the application if a required variable is missing
    }
    return value;
};

// Generate a unique Id for each container using HOSTNAME or fallback to default if undefined
const getUniqueId = (prefix) => {
    const hostname = process.env.HOSTNAME || "default"; // Default to 'default' if HOSTNAME is undefined
    const instanceId = process.env.INSTANCE_ID || Math.random().toString(36).substring(2, 10); // Fallback to random ID if INSTANCE_ID is undefined
    return `${prefix}.${environment}.${hostname}.${instanceId}`;
};

// Validate and fetch Kafka configuration from environment or use defaults
const brokers = getEnvVar("KAFKA_BROKERS", "localhost:9092");
const clientId = getEnvVar("KAFKA_CLIENT_ID", getUniqueClientId('data_collector_client')); // Dynamically generate clientId
const groupId = getEnvVar("KAFKA_GROUP_ID", getUniqueClientId('data_collector_group'));
let logLevel = parseInt(getEnvVar("KAFKA_LOG_LEVEL", "0"), 10);

// Log level validation
if (isNaN(logLevel) || logLevel < 0 || logLevel > 7) {
    console.warn(`WARN: Invalid KAFKA_LOG_LEVEL value. Defaulting to log level: 0`);
    logLevel = 0; // Default log level
}

// Kafka configuration object with fallback values
const config = {
    KAFKA_BROKERS: brokers.split(",").map((broker) => broker.trim()), // Trim to ensure no whitespace issues
    KAFKA_CLIENT_ID: clientId,
    KAFKA_GROUP_ID: groupId,
    KAFKA_LOG_LEVEL: logLevel,
};

// Kafka configuration object for Kafka client
const kafkaConfig = {
    brokers: config.KAFKA_BROKERS,
    clientId: config.KAFKA_CLIENT_ID,
    logLevel: config.KAFKA_LOG_LEVEL,
    retry: {
        initialRetryTime: DEFAULT_INITIAL_RETRY_TIME,
        retries: DEFAULT_RETRIES,
    },
    requestTimeout: DEFAULT_REQUEST_TIMEOUT,
    metadataMaxAge: DEFAULT_METADATA_MAX_AGE,
};

module.exports = { kafkaConfig, config };
