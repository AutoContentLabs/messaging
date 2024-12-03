/**
 * KafkaAdmin.js
 * 
 * This module provides an admin client to interact with Apache Kafka, allowing 
 * for the management of Kafka topics such as creating, listing, deleting, and describing 
 * topics. It uses the KafkaJS library to connect to and manage a Kafka cluster.
 * 
 * @module src/transporters/kafka/KafkaAdmin
 */

const { logger, retry } = require("@auto-content-labs/messaging-utils");

const config = require("./config");
const { topics } = require("../../topics");

const { Kafka } = require("kafkajs");

/**
 * Class representing the Kafka Admin Client.
 * 
 * @class KafkaAdmin
 */
class KafkaAdmin {
    /**
     * Creates an instance of KafkaAdmin.
     * 
     * @constructor
     */
    constructor() {
        this.kafka = new Kafka({
            brokers: [config.kafkaConfig.brokers],
            clientId: config.consumerConfig.clientId,
        });
        this.admin = this.kafka.admin();
    }

    /**
     * Connects the admin client to the Kafka cluster.
     * Logs the success or failure of the connection attempt.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the connection is successful.
     * @throws {Error} Throws an error if the connection fails.
     */
    async connect() {
        try {

            await retry.retryWithBackoff(this.admin.connect());
            logger.debug("[KafkaAdmin] Admin client connected");
        } catch (error) {
            logger.error(`[KafkaAdmin] Admin connection error: ${error.message}`);
            throw error;
        }
    }

    /**
     * Lists all available topics in the Kafka cluster.
     * 
     * @async
     * @returns {Promise<Array<string>>} Resolves with a list of topic names.
     * @throws {Error} Throws an error if the topic listing fails.
     */
    async listTopics() {
        try {
            const currentTopics = await this.admin.listTopics();
            logger.debug(`[KafkaAdmin] Available Topics: ${currentTopics.join(", ")}`);
            return currentTopics;
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to list topics: ${error.message}`);
            throw error;
        }
    }

    // Topic Metadata
    async getTopicMetadata(topicName) {
        try {
            const metadata = await this.admin.fetchTopicMetadata({ topics: [topicName] });
            const partitions = metadata.topics[0].partitions;
            const totalMessages = partitions.reduce((acc, partition) => acc + partition.highWaterMark, 0);
            return { partitions, totalMessages };
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to fetch metadata for ${topicName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Checks the existence of required topics and creates any missing ones.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the check and creation process is complete.
     * @throws {Error} Throws an error if the topic check or creation fails.
     */
    async checkTopics() {
        try {
            logger.debug("[KafkaAdmin] Checking required topics...");

            const existingTopics = await this.listTopics();

            const topicsToCreate = Object.values(topics).filter(
                (topic) => !existingTopics.includes(topic)
            );

            if (topicsToCreate.length > 0) {
                logger.debug(`[KafkaAdmin] Topics to be created: ${topicsToCreate.join(", ")}`);

                await this.createTopics(topicsToCreate);

                logger.debug("[KafkaAdmin] Missing topics created successfully.");
            } else {
                logger.debug("[KafkaAdmin] All required topics are already present.");
            }
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to check topics: ${error.message}`);
            throw error;
        }
    }

    /**
     * Creates the specified topics in the Kafka cluster.
     * 
     * @async
     * @param {Array<string>} topicsToCreate - List of topic names to create.
     * @returns {Promise<void>} Resolves when the topics are successfully created.
     * @throws {Error} Throws an error if topic creation fails.
     */
    async createTopics(topicsToCreate) {
        try {
            const createTopicsResult = await this.admin.createTopics({
                topics: topicsToCreate.map((topic) => ({
                    topic,
                    numPartitions: config.kafkaConfig.numPartitions || 3, // Default value
                    replicationFactor: config.kafkaConfig.replicationFactor || 1, // Must be compatible with the server.
                })),
            });

            if (createTopicsResult) {
                logger.debug("[KafkaAdmin] Topics created successfully.");
            } else {
                logger.debug("[KafkaAdmin] Topics already exist.");
            }
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to create topics: ${error.message}`);
            //throw error; // Optionally throw an error for higher-level handling
        }
    }

    /**
     * Creates a single topic in the Kafka cluster with specified parameters.
     * 
     * @async
     * @param {string} topicName - The name of the topic to create.
     * @param {number} [numPartitions=1] - The number of partitions for the topic.
     * @param {number} [replicationFactor=1] - The replication factor for the topic.
     * @returns {Promise<void>} Resolves when the topic is created or already exists.
     * @throws {Error} Throws an error if the topic creation fails.
     */
    async createTopic(topicName, numPartitions = 1, replicationFactor = 1) {
        try {
            const result = await this.admin.createTopics({
                topics: [
                    {
                        topic: topicName,
                        numPartitions,
                        replicationFactor,
                    },
                ],
            });

            if (result) {
                logger.debug(`[KafkaAdmin] Topic "${topicName}" created.`);
            } else {
                logger.debug(`[KafkaAdmin] Topic "${topicName}" already exists.`);
            }
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to create topic: ${error.message}`);
            throw error;
        }
    }

    /**
     * Deletes a specified topic from the Kafka cluster.
     * 
     * @async
     * @param {string} topicName - The name of the topic to delete.
     * @returns {Promise<void>} Resolves when the topic is deleted.
     * @throws {Error} Throws an error if topic deletion fails.
     */
    async deleteTopic(topicName) {
        try {
            await this.admin.deleteTopics({
                topics: [topicName],
            });
            logger.debug(`[KafkaAdmin] Topic "${topicName}" deleted.`);
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to delete topic: ${error.message}`);
            throw error;
        }
    }

    /**
     * Fetches metadata for a specific topic from the Kafka cluster.
     * 
     * @async
     * @param {string} topicName - The name of the topic to describe.
     * @returns {Promise<Object>} Resolves with the metadata for the topic.
     * @throws {Error} Throws an error if fetching metadata fails.
     */
    async describeTopic(topicName) {
        try {
            const metadata = await this.admin.fetchTopicMetadata({ topics: [topicName] });
            logger.debug(`[KafkaAdmin] Topic metadata: ${JSON.stringify(metadata)}`);
            return metadata;
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to describe topic: ${error.message}`);
            throw error;
        }
    }

    /**
     * Disconnects the admin client from the Kafka cluster.
     * Logs the success or failure of the disconnection attempt.
     * 
     * @async
     * @returns {Promise<void>} Resolves when the disconnection is successful.
     * @throws {Error} Throws an error if the disconnection fails.
     */
    async disconnect() {
        try {
            await this.admin.disconnect();
            logger.debug("[KafkaAdmin] Admin client disconnected");
        } catch (error) {
            logger.error(`[KafkaAdmin] Failed to disconnect: ${error.message}`);
        }
    }
}

module.exports = KafkaAdmin;
