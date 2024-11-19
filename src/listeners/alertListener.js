/**
 * src\listeners\alertListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleAlertRequest } = require("../handlers/alertHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenAlert() {
    const topic = topics.alert
    try {
        // we must use base listener
        listenMessage(topic, handleAlertRequest)

        logger.debug(`[Listener] [listenAlert] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenAlert] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenAlert
}