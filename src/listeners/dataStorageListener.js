/**
 * src\listeners\dataStorageListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataStorage } = require("../handlers/dataStorageHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataStorage() {
    const topic = topics.dataStorage
    try {
        // we must use base listener
        listenMessage(topic, handleDataStorage)

        logger.debug(`[Listener] [listenDataStorage] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataStorage] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataStorage
}