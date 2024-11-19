/**
 * src\listeners\jobScheduleCreateListener.js
 */

const logger = require("../utils/logger")
const { listenMessage } = require("./messageListener")

const { topics } = require("../topics")
const { handleJobScheduleCreateRequest } = require("../handlers/jobScheduleCreateHandler")

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 */
async function listenJobScheduleCreate() {
    const topic = topics.jobScheduleCreate
    try {
        // we must use base listener
        listenMessage(topic, handleJobScheduleCreateRequest)

        logger.debug(`[Listener] [listenJobScheduleCreate] [debug] listener start`);
    } catch (error) {
        logger.error(`[Listener] [listenJobScheduleCreate] [error] listener error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenJobScheduleCreate
}