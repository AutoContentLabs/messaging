/**
 * src\listeners\dataCollectErrorListener.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataCollectErrorRequest } = require("../handlers/dataCollectErrorHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataCollectError() {
    const topic = topics.dataCollectError
    try {
        // we must use base listener
        listenMessage(topic, handleDataCollectErrorRequest)

        logger.debug(`[Listener] [listenDataCollectError] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataCollectError] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataCollectError
}