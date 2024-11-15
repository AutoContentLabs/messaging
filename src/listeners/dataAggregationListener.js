/**
 * src\listeners\dataAggregationListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDataAggregation } = require("../handlers/dataAggregationHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDataAggregation() {
    const topic = topics.dataAggregation
    try {
        // we must use base listener
        listenMessage(topic, handleDataAggregation)

        logger.debug(`[Listener] [listenDataAggregation] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDataAggregation] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDataAggregation
}