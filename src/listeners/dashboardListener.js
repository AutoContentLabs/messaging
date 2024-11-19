/**
 * src\listeners\dashboardListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleDashboardRequest } = require("../handlers/dashboardHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenDashboard() {
    const topic = topics.dashboard
    try {
        // we must use base listener
        listenMessage(topic, handleDashboardRequest)

        logger.debug(`[Listener] [listenDashboard] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenDashboard] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenDashboard
}