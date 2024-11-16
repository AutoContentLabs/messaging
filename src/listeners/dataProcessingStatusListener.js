/**
 * src\listeners\dataProcessingStatusListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataProcessingStatus } = require("../handlers/dataProcessingStatusHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataProcessingStatus() {
    const topic = topics.dataProcessingStatus
    try {
        // we must use base listener
        listenMessage(topic, handleDataProcessingStatus)

        logger.debug(`[Listener] [listenDataProcessingStatus] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataProcessingStatus] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataProcessingStatus
}