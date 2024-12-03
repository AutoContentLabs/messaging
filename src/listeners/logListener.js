/**
 * src\listeners\logListener.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleLogRequest } = require("../handlers/logHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenLog() {
    const topic = topics.log
    try {
        // we must use base listener
        listenMessage(topic, handleLogRequest)

        logger.debug(`[Listener] [listenLog] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenLog] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenLog
}