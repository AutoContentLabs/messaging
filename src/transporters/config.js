/**
 * Environment Variables Configuration
 * 
 * This module handles the configuration of environment variables used in the application.
 * It ensures that required environment variables are provided, and default values are used when appropriate.
 * It also provides helper functions for getting different types of environment variables and configuring Kafka-related settings.
 * 
 * @module transporters/config
 */

// Instance information and network details
const instanceInfo = require('../utils/instance');

// Instance details such as host, IP, and MAC address
const { hostInfo } = instanceInfo.getInstanceInfo();
const ipv4Addresses = instanceInfo.getIpAddress('IPv4')
const ipv4Address = ipv4Addresses[0]
const macAddress = instanceInfo.getMacAddress(ipv4Address)

/**
 * Fetches an environment variable as a string.
 * 
 * @param {string} key - The key of the environment variable.
 * @param {string} defaultValue - The default value to return if the variable is not found.
 * @param {boolean} [isRequired=false] - Whether the variable is required. If true and missing, the application will exit.
 * @returns {string} The value of the environment variable.
 * @throws {Error} Will terminate the application if a required variable is missing.
 */
const getStringEnvironmentVariable = (key, defaultValue, isRequired = false) => {
    const value = process.env[key] || defaultValue;
    if (isRequired && !value) {
        console.error(`ERROR: Required environment variable ${key} is missing.`);
        process.exit(1); // Exit the application if a required variable is missing
    }
    return value;
}

/**
 * Fetches an environment variable and converts it to an integer.
 * 
 * @param {string} key - The key of the environment variable.
 * @param {number} defaultValue - The default value to return if the variable is not found.
 * @returns {number} The integer value of the environment variable.
 */
const getIntEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue);
    return parseInt(value, 10);
}

/**
 * Fetches an environment variable and converts it to a boolean.
 * 
 * @param {string} key - The key of the environment variable.
 * @param {boolean} defaultValue - The default value to return if the variable is not found.
 * @returns {boolean} The boolean value of the environment variable.
 */
const getBoolEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue);
    return value === 'true' || value === true;
}

/**
 * Fetches an environment variable and converts it to an array.
 * 
 * @param {string} key - The key of the environment variable.
 * @param {Array} defaultValue - The default array to return if the variable is not found.
 * @returns {Array} The array of values.
 */
const getArrayEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue);
    return value.split(",").map((v) => v.trim());
}

/**
 * Generates a unique identifier for the instance based on the hostname and IP/MAC address.
 * 
 * @param {string} prefix - The prefix to prepend to the unique ID.
 * @returns {string} The unique identifier for the instance.
 */
const getUniqueId = (prefix) => {
    const hostname = process.env.HOSTNAME || hostInfo.name
    const instanceId = process.env.INSTANCE_ID || `${ipv4Address}-${macAddress}`
    return `${prefix}.${hostname}`; // short version
    // The more detailed version is included below:
    // return `${prefix}.${process.env.NODE_ENV || 'development'}.${hostname}.${instanceId}`;
};

let APP_LOG_LEVEL = getStringEnvironmentVariable("APP_LOG_LEVEL", "info")
let MESSAGE_SYSTEM = getStringEnvironmentVariable("MESSAGE_SYSTEM", "redis")
let CLIENT_ID = getStringEnvironmentVariable("CLIENT_ID", getUniqueId('client'));
let GROUP_ID = getStringEnvironmentVariable("GROUP_ID", getUniqueId('group'));

// Kafka-related environment variables
let KAFKA_BROKERS = getArrayEnvironmentVariable("KAFKA_BROKERS", 'localhost:9092');
let KAFKA_CLIENT_ID = getStringEnvironmentVariable("KAFKA_CLIENT_ID", CLIENT_ID);
let KAFKA_GROUP_ID = getStringEnvironmentVariable("KAFKA_GROUP_ID", GROUP_ID);
let KAFKA_LOG_LEVEL = getStringEnvironmentVariable("KAFKA_LOG_LEVEL", '0'); // INFO level
let KAFKA_HEARTBEAT_INTERVAL = getIntEnvironmentVariable("KAFKA_HEARTBEAT_INTERVAL", 1000); // 1000ms
let KAFKA_SESSION_TIMEOUT = getIntEnvironmentVariable("KAFKA_SESSION_TIMEOUT", 3000); // 3000ms
let KAFKA_CONNECTION_TIMEOUT = getIntEnvironmentVariable("KAFKA_CONNECTION_TIMEOUT", 3000); // 3 seconds
let KAFKA_AUTHENTICATION_TIMEOUT = getIntEnvironmentVariable("KAFKA_AUTHENTICATION_TIMEOUT", 3000); // 3 seconds
let KAFKA_REQUEST_TIMEOUT = getIntEnvironmentVariable("KAFKA_REQUEST_TIMEOUT", 3000); // 3 seconds
let KAFKA_ACKS = getStringEnvironmentVariable("KAFKA_ACKS", 'all');
let KAFKA_RETRIES = getIntEnvironmentVariable("KAFKA_RETRIES", 10); // 10 retries
let KAFKA_INITIAL_RETRY_TIME = getIntEnvironmentVariable("KAFKA_INITIAL_RETRY_TIME", 300); // 300ms
let KAFKA_METADATA_MAX_AGE = getIntEnvironmentVariable("KAFKA_METADATA_MAX_AGE", 30000); // 30 seconds
let KAFKA_NUM_PARTITIONS = getIntEnvironmentVariable("KAFKA_NUM_PARTITIONS", 3); // 3 partitions
let KAFKA_REPLICATION_FACTOR = getIntEnvironmentVariable("KAFKA_REPLICATION_FACTOR", 1); // 1 replication factor
let KAFKA_AUTO_COMMIT = getBoolEnvironmentVariable("KAFKA_AUTO_COMMIT", true); // Manual commit control
let KAFKA_AUTO_COMMIT_INTERVAL = getIntEnvironmentVariable("KAFKA_AUTO_COMMIT_INTERVAL", 5000); // 5 seconds
let KAFKA_MIN_BYTES = getIntEnvironmentVariable("KAFKA_MIN_BYTES", 1024); // 1KB minimum
let KAFKA_MAX_BYTES = getIntEnvironmentVariable("KAFKA_MAX_BYTES", 10485760); // 10MB maximum
let KAFKA_MAX_WAIT_TIME_IN_MS = getIntEnvironmentVariable("KAFKA_MAX_WAIT_TIME_IN_MS", 1000); // 1 second
let KAFKA_BATCH_SIZE = getIntEnvironmentVariable("KAFKA_BATCH_SIZE", 32768); // 32KB batch size
let KAFKA_LINGER_MS = getIntEnvironmentVariable("KAFKA_LINGER_MS", 100); // 100ms linger time
let KAFKA_KEY_SERIALIZER = getStringEnvironmentVariable("KAFKA_KEY_SERIALIZER", 'org.apache.kafka.common.serialization.StringSerializer');
let KAFKA_VALUE_SERIALIZER = getStringEnvironmentVariable("KAFKA_VALUE_SERIALIZER", 'org.apache.kafka.common.serialization.StringSerializer');

// Redis
let REDIS_HOST_ADDRESS = getStringEnvironmentVariable("REDIS_HOST_ADDRESS", '127.0.0.1');
let REDIS_HOST_PORT = getIntEnvironmentVariable("REDIS_HOST_PORT", 6379);
let REDIS_CLIENT_ID = getStringEnvironmentVariable("REDIS_CLIENT_ID", CLIENT_ID);
let REDIS_GROUP_ID = getStringEnvironmentVariable("REDIS_GROUP_ID", GROUP_ID);

// Redis
let RABBITMQ_HOST_ADDRESS = getStringEnvironmentVariable("RABBITMQ_HOST_ADDRESS", '127.0.0.1');
let RABBITMQ_HOST_PORT = getIntEnvironmentVariable("RABBITMQ_HOST_PORT", 5672);
let RABBITMQ_DEAULT_USER = getStringEnvironmentVariable("RABBITMQ_DEAULT_USER", 'guest');
let RABBITMQ_DEFAULT_PASSWORD = getStringEnvironmentVariable("RABBITMQ_DEFAULT_PASSWORD", 'guest');
let RABBITMQ_CLIENT_ID = getStringEnvironmentVariable("RABBITMQ_CLIENT_ID", CLIENT_ID);
let RABBITMQ_GROUP_ID = getStringEnvironmentVariable("RABBITMQ_GROUP_ID", GROUP_ID);

// telemetry's
// Zipkin Configuration
let ZIPKIN_HOST_ADDRESS = getStringEnvironmentVariable("ZIPKIN_HOST_ADDRESS", 'localhost');
let ZIPKIN_HOST_PORT = getIntEnvironmentVariable("ZIPKIN_HOST_PORT", 9411);
// Jaeger Configuration
let JAEGER_HOST_ADDRESS = getStringEnvironmentVariable("JAEGER_HOST_ADDRESS", 'localhost');
let JAEGER_OTLP_GRPC_PORT = getIntEnvironmentVariable("JAEGER_OTLP_GRPC_PORT", 4317);
let JAEGER_OTLP_HTTP_PORT = getIntEnvironmentVariable("JAEGER_OTLP_HTTP_PORT", 4318);
let JAEGER_AGENT_PORT = getIntEnvironmentVariable("JAEGER_AGENT_PORT", 5778);
let JAEGER_ZIPKIN_PORT = getIntEnvironmentVariable("JAEGER_ZIPKIN_PORT", 9412);
let JAEGER_HOST_PORT = getIntEnvironmentVariable("JAEGER_HOST_PORT", 14250);
let JAEGER_HTTP_PORT = getIntEnvironmentVariable("JAEGER_HTTP_PORT", 14268);
let JAEGER_UI_PORT = getIntEnvironmentVariable("JAEGER_UI_PORT", 16686);

/**
 * Validates the Kafka log level environment variable.
 * If the value is invalid, it will default to log level 0 (INFO).
 */
if (isNaN(KAFKA_LOG_LEVEL) || KAFKA_LOG_LEVEL < 0 || KAFKA_LOG_LEVEL > 7) {
    console.warn(`WARN: Invalid KAFKA_LOG_LEVEL value. Defaulting to log level: 0`);
    KAFKA_LOG_LEVEL = '0';
}

// Export the Kafka and other environment variables for use in the application
module.exports = {
    // APP
    APP_LOG_LEVEL,
    MESSAGE_SYSTEM,
    CLIENT_ID,
    GROUP_ID,
    // KAFKA
    KAFKA_BROKERS,
    KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID,
    KAFKA_LOG_LEVEL,
    KAFKA_HEARTBEAT_INTERVAL,
    KAFKA_SESSION_TIMEOUT,
    KAFKA_CONNECTION_TIMEOUT,
    KAFKA_AUTHENTICATION_TIMEOUT,
    KAFKA_REQUEST_TIMEOUT,
    KAFKA_ACKS,
    KAFKA_RETRIES,
    KAFKA_INITIAL_RETRY_TIME,
    KAFKA_METADATA_MAX_AGE,
    KAFKA_NUM_PARTITIONS,
    KAFKA_REPLICATION_FACTOR,
    KAFKA_AUTO_COMMIT,
    KAFKA_AUTO_COMMIT_INTERVAL,
    KAFKA_MIN_BYTES,
    KAFKA_MAX_BYTES,
    KAFKA_MAX_WAIT_TIME_IN_MS,
    KAFKA_BATCH_SIZE,
    KAFKA_LINGER_MS,
    KAFKA_KEY_SERIALIZER,
    KAFKA_VALUE_SERIALIZER,
    // REDIS
    REDIS_HOST_ADDRESS,
    REDIS_HOST_PORT,
    REDIS_CLIENT_ID,
    REDIS_GROUP_ID,
    // RabbitMQ
    RABBITMQ_HOST_ADDRESS,
    RABBITMQ_HOST_PORT,
    RABBITMQ_DEAULT_USER,
    RABBITMQ_DEFAULT_PASSWORD,
    RABBITMQ_CLIENT_ID,
    RABBITMQ_GROUP_ID,
    // Telemetrys
    // Zipkin Configuration
    ZIPKIN_HOST_ADDRESS,
    ZIPKIN_HOST_PORT,
    // Jaeger Configuration
    JAEGER_HOST_ADDRESS,
    JAEGER_OTLP_GRPC_PORT,
    JAEGER_OTLP_HTTP_PORT,
    JAEGER_AGENT_PORT,
    JAEGER_ZIPKIN_PORT,
    JAEGER_HOST_PORT,
    JAEGER_HTTP_PORT,
    JAEGER_UI_PORT
};
