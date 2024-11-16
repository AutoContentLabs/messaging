/**
 * src\listeners\analysisErrorListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleAnalysisError } = require("../handlers/analysisErrorHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenAnalysisError() {
    const topic = topics.analysisError
    try {
        // we must use base listener
        listenMessage(topic, handleAnalysisError)

        logger.debug(`[Listener] [listenAnalysisError] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenAnalysisError] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenAnalysisError
}