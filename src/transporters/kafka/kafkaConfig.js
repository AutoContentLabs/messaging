/**
 * KafkaConfig
 */
const config = require("../config")

const brokers = config.KAFKA_BROKERS
const clientId = config.KAFKA_CLIENT_ID
const groupId = config.KAFKA_GROUP_ID
const logLevel = config.KAFKA_LOG_LEVEL
const retry = {
    initialRetryTime: config.KAFKA_INITIAL_RETRY_TIME,
    retries: config.KAFKA_RETRIES,
}
const requestTimeout = config.KAFKA_REQUEST_TIMEOUT
const metadataMaxAge = config.KAFKA_METADATA_MAX_AGE
const numPartitions = config.KAFKA_NUM_PARTITIONS
const replicationFactor = config.KAFKA_REPLICATION_FACTOR
const autoCommit = config.KAFKA_AUTO_COMMIT
const autoCommitInterval = config.KAFKA_AUTO_COMMIT_INTERVAL
const minBytes = config.KAFKA_MIN_BYTES
const maxBytes = config.KAFKA_MAX_BYTES
const maxWaitTimeInMs = config.KAFKA_MAX_WAIT_TIME_IN_MS
module.exports = {
    brokers,
    clientId,
    groupId,
    logLevel,
    retry,
    requestTimeout,
    metadataMaxAge,
    numPartitions,
    replicationFactor,
    autoCommit,
    autoCommitInterval,
    minBytes,
    maxBytes,
    maxWaitTimeInMs
}