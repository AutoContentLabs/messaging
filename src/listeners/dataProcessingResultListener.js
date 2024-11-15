/**
 * src\listeners\dataProcessingResultListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataProcessingResult } = require("../handlers/dataProcessingResultHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataProcessingResult() {
    const topic = topics.dataProcessingResult
    try {
        // we must use base listener
        listenMessage(topic, handleDataProcessingResult)

        logger.debug(`[Listener] [listenDataProcessingResult] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataProcessingResult] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataProcessingResult
}