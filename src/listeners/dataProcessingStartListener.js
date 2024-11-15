/**
 * src\listeners\dataProcessingStartListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataProcessingStart } = require("../handlers/dataProcessingStartHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataProcessingStart() {
    const topic = topics.dataProcessingStart
    try {
        // we must use base listener
        listenMessage(topic, handleDataProcessingStart)

        logger.debug(`[Listener] [listenDataProcessingStart] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataProcessingStart] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataProcessingStart
}