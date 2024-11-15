/**
 * src\listeners\jobStatusListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleJobStatus } = require("../handlers/jobStatusHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenJobStatus() {
    const topic = topics.jobStatus
    try {
        // we must use base listener
        listenMessage(topic, handleJobStatus)

        logger.debug(`[Listener] [listenJobStatus] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenJobStatus] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenJobStatus
}