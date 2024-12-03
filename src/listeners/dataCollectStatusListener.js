/**
 * src\listeners\dataCollectStatusListener.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataCollectStatusRequest } = require("../handlers/dataCollectStatusHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataCollectStatus() {
    const topic = topics.dataCollectStatus
    try {
        // we must use base listener
        listenMessage(topic, handleDataCollectStatusRequest)

        logger.debug(`[Listener] [listenDataCollectStatus] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataCollectStatus] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataCollectStatus
}