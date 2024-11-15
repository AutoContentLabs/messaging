/**
 * src\transporters\kafka\kafkaClient.js
 */
const logger = require("../../utils/logger")
const kafkaConfig = require("./kafkaConfig")
const { topics } = require("../../topics")
const { Kafka, Partitioners } = require('kafkajs');

let kafka, producer, consumer
let compressionType = 1 // CompressionTypes.GZIP
// Clean shutdown
process.on('SIGINT', async () => {
    try {

        // Producer connection
        if (producer) {
            await producer.disconnect();
            logger.debug(`[SIGINT] [producer] disconnected`);
        }

        // Kafka consumer connection
        if (consumer) {
            await consumer.disconnect();
            logger.debug(`[SIGINT] [consumer] disconnected`);
        }

    } catch (error) {
        logger.error(`[SIGINT] [shutdown] [error] ${error.message}`);
    } finally {
        logger.info(`[SIGINT] [shutdown] Application shutting down...`);
        process.exit(0); // Gracefully shutdown the application
    }
});

/**
 * 
 * @param {*} admin 
 * @param {*} topic 
 */
async function createTopicIfNotExists(admin, topic) {
    try {
        const currentTopics = await admin.listTopics();
        if (!currentTopics.includes(topic)) {
            await admin.createTopics({
                topics: [
                    {
                        topic,
                        numPartitions: kafkaConfig.numPartitions,
                        replicationFactor: kafkaConfig.replicationFactor
                    },
                ],
            });
            logger.debug(`[TOPIC] [create] Topic created: ${topic}`);
        } else {
            logger.debug(`[TOPIC] [exists] Topic already exists: ${topic}`);
        }
    } catch (error) {
        logger.error(`[TOPIC] [create] [error] ${topic} - ${error.message}`);
    }
}

/**
 * 
 */
async function checkTopics() {
    const topicList = Object.values(topics);
    const admin = kafka.admin();
    try {
        await admin.connect();
        for (const topic of topicList) {
            await createTopicIfNotExists(admin, topic);
        }
    } catch (error) {
        logger.error(`[TOPIC] [check] [error] ${error.message}`);
    } finally {
        await admin.disconnect();
    }
}

/**
 * 
 * @param {*} kafkaConfig 
 */
async function init(kafkaConfig) {
    kafka = await new Kafka(kafkaConfig);

    await checkTopics()

    producer = await kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    consumer = await kafka.consumer({ groupId: kafkaConfig.groupId });

}

module.exports = {
    init,
    producer,
    compressionType,
    consumer
}