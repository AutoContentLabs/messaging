// src/transports/kafka/config.js

const environment = process.env.NODE_ENV || "development";

const config = {
    KAFKA_BROKERS: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || `data_collector.client.${environment}`,
    KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || `data_collector.collect.group.${environment}`,
    KAFKA_LOG_LEVEL: parseInt(process.env.KAFKA_LOG_LEVEL || "1", 10),
};

const kafkaConfig = {
    brokers: config.KAFKA_BROKERS,
    clientId: config.KAFKA_CLIENT_ID,
    groupId: config.KAFKA_GROUP_ID,
    logLevel: config.KAFKA_LOG_LEVEL,
    retry: { initialRetryTime: 1000, retries: 10 },
    requestTimeout: 60000,
    metadataMaxAge: 60000,
};

module.exports = kafkaConfig;

