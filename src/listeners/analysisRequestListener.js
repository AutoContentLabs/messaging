/**
 * src\listeners\analysisRequestListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleAnalysisRequest } = require("../handlers/analysisRequestHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenAnalysisRequest() {
    const topic = topics.analysisRequest
    try {
        // we must use base listener
        listenMessage(topic, handleAnalysisRequest)

        logger.debug(`[Listener] [listenAnalysisRequest] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenAnalysisRequest] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenAnalysisRequest
}