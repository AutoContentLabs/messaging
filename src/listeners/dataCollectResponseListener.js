/**
 * src\listeners\dataCollectResponseListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataCollectResponse } = require("../handlers/dataCollectResponseHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataCollectResponse() {
    const topic = topics.dataCollectResponse
    try {
        // we must use base listener
        listenMessage(topic, handleDataCollectResponse)

        logger.debug(`[Listener] [listenDataCollectResponse] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataCollectResponse] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataCollectResponse
}