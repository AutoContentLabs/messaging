/**
 * Environment Variables
 * src\transporters\config.js
 */

const environment = process.env.NODE_ENV || "development";

const getStringEnvironmentVariable = (key, defaultValue, isRequired = false) => {
    const value = process.env[key] || defaultValue;
    if (isRequired && !value) {
        console.error(`ERROR: Required environment variable ${key} is missing.`);
        process.exit(1); // Exit the application if a required variable is missing
    }
    return value;
}

const getIntEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue)
    return parseInt(value, 10)
}

const getArrayEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue)
    return value.split(",").map((v) => v.trim())
}

const getBoolEnvironmentVariable = (key, defaultValue) => {
    const value = getStringEnvironmentVariable(key, defaultValue)
    return value
}

const getUniqueId = (prefix) => {
    const hostname = process.env.HOSTNAME || "default"; // Default to 'default' if HOSTNAME is undefined
    const instanceId = process.env.INSTANCE_ID || Math.random().toString(36).substring(2, 10); // Fallback to random ID if INSTANCE_ID is undefined
    return `${prefix}.${environment}.${hostname}.${instanceId}`;
};

let APP_LOG_LEVEL = getStringEnvironmentVariable("APP_LOG_LEVEL", "debug")
let KAFKA_LOG_LEVEL = getStringEnvironmentVariable("KAFKA_LOG_LEVEL", 0)
let KAFKA_BROKERS = getArrayEnvironmentVariable("KAFKA_BROKERS", 'localhost:9092')
let KAFKA_CLIENT_ID = getStringEnvironmentVariable("KAFKA_CLIENT_ID", getUniqueId('client'))
let KAFKA_GROUP_ID = getStringEnvironmentVariable("KAFKA_GROUP_ID", getUniqueId('group'))
let KAFKA_RETRIES = getIntEnvironmentVariable("KAFKA_RETRIES", 5)
let KAFKA_INITIAL_RETRY_TIME = getIntEnvironmentVariable("KAFKA_INITIAL_RETRY_TIME", 200)
let KAFKA_REQUEST_TIMEOUT = getIntEnvironmentVariable("KAFKA_REQUEST_TIMEOUT", 60000) // 500 or 30000
let KAFKA_METADATA_MAX_AGE = getIntEnvironmentVariable("KAFKA_METADATA_MAX_AGE", 10000)
let KAFKA_NUM_PARTITIONS = getIntEnvironmentVariable("KAFKA_NUM_PARTITIONS", 3)
let KAFKA_REPLICATION_FACTOR = getIntEnvironmentVariable("KAFKA_REPLICATION_FACTOR", 1)
let KAFKA_AUTO_COMMIT = getBoolEnvironmentVariable("KAFKA_AUTO_COMMIT", true)
let KAFKA_AUTO_COMMIT_INTERVAL = getIntEnvironmentVariable("KAFKA_AUTO_COMMIT_INTERVAL", 10000)
let KAFKA_MIN_BYTES = getIntEnvironmentVariable("KAFKA_MIN_BYTES", 1)
let KAFKA_MAX_BYTES = getIntEnvironmentVariable("KAFKA_MAX_BYTES", 1024)
let KAFKA_MAX_WAIT_TIME_IN_MS = getIntEnvironmentVariable("KAFKA_MAX_WAIT_TIME_IN_MS", 500)

if (isNaN(KAFKA_LOG_LEVEL) || KAFKA_LOG_LEVEL < 0 || KAFKA_LOG_LEVEL > 7) {
    console.warn(`WARN: Invalid KAFKA_LOG_LEVEL value. Defaulting to log level: 0`);
    KAFKA_LOG_LEVEL = 0; // Default log level
}

module.exports = {
    APP_LOG_LEVEL,
    KAFKA_LOG_LEVEL,
    KAFKA_BROKERS,
    KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID,
    KAFKA_RETRIES,
    KAFKA_INITIAL_RETRY_TIME,
    KAFKA_REQUEST_TIMEOUT,
    KAFKA_METADATA_MAX_AGE,
    KAFKA_NUM_PARTITIONS,
    KAFKA_REPLICATION_FACTOR,
    KAFKA_AUTO_COMMIT,
    KAFKA_AUTO_COMMIT_INTERVAL,
    KAFKA_MIN_BYTES,
    KAFKA_MAX_BYTES,
    KAFKA_MAX_WAIT_TIME_IN_MS
}