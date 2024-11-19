/**
 * src\listeners\jobProgressListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleJobProgressRequest } = require("../handlers/jobProgressHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenJobProgress() {
    const topic = topics.jobProgress
    try {
        // we must use base listener
        listenMessage(topic, handleJobProgressRequest)

        logger.debug(`[Listener] [listenJobProgress] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenJobProgress] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenJobProgress
}