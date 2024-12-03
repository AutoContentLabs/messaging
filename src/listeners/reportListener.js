/**
 * src\listeners\reportListener.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleReportRequest } = require("../handlers/reportHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenReport() {
    const topic = topics.report
    try {
        // we must use base listener
        listenMessage(topic, handleReportRequest)

        logger.debug(`[Listener] [listenReport] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenReport] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenReport
}