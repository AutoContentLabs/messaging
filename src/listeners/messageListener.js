/**
 * Message Listener with retry and safe JSON parse
 * src/listeners/messageListener.js
 */

const { logger, retry, telemetry } = require("@auto-content-labs/messaging-utils");

const config = require("../transporters/config");
const transporters = require("../transporters");

function getTransporter(transporterName) {
    if (!transporterName || !transporters[transporterName]) {
        throw new Error(`Transporter "${transporterName}" not found.`);
    }
    return transporters[transporterName];
}

const transporter = getTransporter(config.MESSAGE_SYSTEM);
const transporter_name = transporter.Name;

/**
 * @param {string} eventName 
 * @param {function({ key: (any|undefined), value: any })} handler - Callback function to process message data.
 */
async function registerListenerWithHandler(eventName, handler) {
    // transport
    const topic = eventName
    await transporter.listenMessage(topic, async (pair) => {

        try {
            // start telemetry
            const span = telemetry.start("listen", eventName, pair)

            logger.debug(`[messageListener] [register] [debug] Received message from event: ${eventName}`, pair);
            //
            await handler(pair);

            // End Trace (Span)
            span.end();

        } catch (handlerError) {
            // logger.error(`[messageListener] [register] [error] Error processing message for event: ${eventName}, error: ${handlerError.message}`, pair);
        }
    });
}

/**
 * Listens for incoming messages and triggers a handler when a specific message is received.
 * 
 * @param {string} eventname - The name of the event/topic/channel to listen for.
 * @param {function({ key: (any|undefined), value: any })} handler - Callback function to process message data.
 * @returns {Promise<void>} - Indicates the completion of the listener setup.
 * 
 * @example
 * // Example usage:
 * 
 * // topic = channel = event
 * const eventName = "test";
 * 
 * listenMessage(eventName, async ({ key, value }) => {
 *      console.log("Message Key:", key);
 *      console.log("Message Value:", value);
 * });
 * 
 */
async function listenMessage(eventName, handler) {

    try {
        logger.info(`[messageListener] [listenMessage] [info] Starting: ${eventName}, transporter: ${transporter_name}`, eventName);

        await retry.retryWithBackoff(
            () => registerListenerWithHandler(eventName, handler),
            5, // Max retry count
            1000 // Initial delay in ms
        );

        logger.info(`[messageListener] [listenMessage] [info] Listener started: ${eventName}`);
    } catch (error) {
        logger.error(`[messageListener] [listenMessage] [error] Failed to start listener: "${eventName}", transporter: ${transporter_name}, error: ${error.message}`);
        throw error; // 
    }
}

module.exports = {
    listenMessage,
};
