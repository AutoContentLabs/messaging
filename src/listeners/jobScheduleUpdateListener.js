/**
 * src\listeners\jobScheduleUpdateListener.js
 */

const { logger } = require("@auto-content-labs/messaging-utils");
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleJobScheduleUpdateRequest } = require("../handlers/jobScheduleUpdateHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenJobScheduleUpdate() {
    const topic = topics.jobScheduleUpdate
    try {
        // we must use base listener
        listenMessage(topic, handleJobScheduleUpdateRequest)

        logger.debug(`[Listener] [listenJobScheduleUpdate] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenJobScheduleUpdate] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenJobScheduleUpdate
}