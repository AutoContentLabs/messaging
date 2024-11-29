/**
 * src\listeners\dataCollectRequestListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataCollectRequest } = require("../handlers/dataCollectRequestHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataCollectRequest() {
    const topic = topics.dataCollectRequest
    try {
        // we must use base listener
        listenMessage(topic, handleDataCollectRequest)

        logger.debug(`[Listener] [listenDataCollectRequest] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataCollectRequest] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataCollectRequest
}