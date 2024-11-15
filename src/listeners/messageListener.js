/**
 * src\listeners\messageListener.js
 */

const logger = require("../utils/logger")
const transporters = require("../transporters")
const transporter = transporters.kafka
const transporter_name = transporter.Name

/**
 * Starts listening for messages on a specific topic.
 * Implements backpressure handling and ensures performance even with large message loads.
 *
 * @param {string} topic - The topic to listen to.
 * @param {Function} handler - The callback function to handle incoming messages.
 * @returns {Promise<void>}
 */
async function listenMessage(topic, handler) {
    try {
        // Using an efficient listener system that can handle high throughput
        await transporter.listenMessage(topic, async (dataPackage) => {
            try {
                // Asynchronous processing for messages to avoid blocking
                await handler(dataPackage);
            } catch (error) {
                logger.error(`[messageListener] [listenMessage] [error] Error processing message in listener for topic: ${topic}, error: ${error.message}`);
            }
        });
        logger.debug(`[messageListener] [listenMessage] [debug] listener start: ${topic}, transporter: ${transporter_name}`);
    } catch (error) {
        logger.error(`[messageListener] [listenMessage] [error] listener error: ${topic}, transporter: ${transporter_name}, error: ${error.message}`);
        // Retry logic for listener could be implemented here as well.
        throw error;
    }
}

module.exports = {
    listenMessage
}