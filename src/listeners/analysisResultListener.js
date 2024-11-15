/**
 * src\listeners\analysisResultListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleAnalysisResult } = require("../handlers/analysisResultHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenAnalysisResult() {
    const topic = topics.analysisResult
    try {
        // we must use base listener
        listenMessage(topic, handleAnalysisResult)

        logger.debug(`[Listener] [listenAnalysisResult] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenAnalysisResult] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenAnalysisResult
}