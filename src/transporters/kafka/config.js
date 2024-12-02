// Importing environment variable settings from config.js
const config = require('../config.js');

// Consolidated Kafka Configuration Object
const kafkaConfig = {
    brokers: config.KAFKA_BROKERS || "127.0.0.1:9092",
    logLevel: config.KAFKA_LOG_LEVEL || 'info',
    connectionTimeout: config.KAFKA_CONNECTION_TIMEOUT || 3000,
    authenticationTimeout: config.KAFKA_AUTHENTICATION_TIMEOUT || 1000,
    requestTimeout: config.KAFKA_REQUEST_TIMEOUT || 30000,
    acks: config.KAFKA_ACKS || -1,
    retries: config.KAFKA_RETRIES || 5,
    initialRetryTime: config.KAFKA_INITIAL_RETRY_TIME || 300,
    metadataMaxAge: config.KAFKA_METADATA_MAX_AGE || 300000,
    numPartitions: config.KAFKA_NUM_PARTITIONS || 1,
    replicationFactor: config.KAFKA_REPLICATION_FACTOR || 1,
    autoCommit: config.KAFKA_AUTO_COMMIT !== undefined ? config.KAFKA_AUTO_COMMIT : true,
    autoCommitInterval: config.KAFKA_AUTO_COMMIT_INTERVAL || 5000,
    minBytes: config.KAFKA_MIN_BYTES || 1,
    maxBytes: config.KAFKA_MAX_BYTES || 1048576,
    maxWaitTimeInMs: config.KAFKA_MAX_WAIT_TIME_IN_MS || 100,
    batchSize: config.KAFKA_BATCH_SIZE || 1000,
    lingerMs: config.KAFKA_LINGER_MS || 1,
    keySerializer: config.KAFKA_KEY_SERIALIZER || JSON.stringify,
    valueSerializer: config.KAFKA_VALUE_SERIALIZER || JSON.stringify,
};

// Consumer Configuration
const consumerConfig = {
    clientId: `consumer.${config.KAFKA_CLIENT_ID || 'default-client'}`,
    groupId: `consumer.${config.KAFKA_GROUP_ID || 'default-group'}`,
    enableAutoCommit: kafkaConfig.autoCommit,
    heartbeatInterval: config.KAFKA_HEARTBEAT_INTERVAL || 3000,
    sessionTimeout: config.KAFKA_SESSION_TIMEOUT || 10000,
    maxPollInterval: kafkaConfig.maxWaitTimeInMs,
};

// Producer Configuration
const producerConfig = {
    clientId: `producer.${config.KAFKA_CLIENT_ID || 'default-client'}`,
    acks: kafkaConfig.acks,
    retries: kafkaConfig.retries,
    batchSize: kafkaConfig.batchSize,
    lingerMs: kafkaConfig.lingerMs,
    keySerializer: kafkaConfig.keySerializer,
    valueSerializer: kafkaConfig.valueSerializer,
};

// Export the configurations
module.exports = {
    kafkaConfig,
    consumerConfig,
    producerConfig,
};
