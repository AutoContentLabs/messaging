/**
 * Message Listener with retry, telemetry, and enhanced logging.
 * src/listeners/messageListener.js
 */

const config = require("../transporters/config");

const serviceName = `${config.GROUP_ID}-${config.MESSAGE_SYSTEM}`;
const exporterConfig = {
    zipkin: {
        url: `http://${config.ZIPKIN_HOST_ADDRESS}:${config.ZIPKIN_HOST_PORT}/api/v2/spans`,
    },
    jaeger: {
        endpoint: `http://${config.JAEGER_HOST_ADDRESS}:${config.JAEGER_HTTP_PORT}/api/traces`,
    },
    otlp: {
        url: `http://${config.OTLP_HOST_ADDRESS}:${config.OTLP_HOST_PORT}`,
    },
};

const { logger, retry, Telemetry } = require("@auto-content-labs/messaging-utils");
const telemetry = new Telemetry(serviceName, exporterConfig);

const transporters = require("../transporters");

/**
 * Retrieves the transporter object based on the provided name.
 * @param {string} transporterName - Name of the transporter.
 * @returns {object} - Transporter instance.
 * @throws {Error} - If transporter not found.
 */
function getTransporter(transporterName) {
    if (!transporterName || !transporters[transporterName]) {
        throw new Error(`Transporter "${transporterName}" not found.`);
    }
    return transporters[transporterName];
}

const transporter = getTransporter(config.MESSAGE_SYSTEM);
const transporterName = transporter.Name;

/**
 * Registers a message listener for a given event and processes it with telemetry and error handling.
 * @param {string} eventName - Name of the event to listen to.
 * @param {function({ key: any, value: any })} handler - Callback to process message data.
 */
async function registerListenerWithHandler(eventName, handler) {
    const topic = eventName;

    await transporter.listenMessage(topic, async (pair) => {
        const span = telemetry.start("listen", eventName, pair);
        const startTimeMs = span.startTime[0] * 1000 + span.startTime[1] / 1_000_000;

        try {
            logger.debug(`[messageListener] Received message for event: "${eventName}"`, { pair });

            // Process the message using the handler
            await handler(pair);

            // End Telemetry
            span.end();

            // Measure and log the duration
            const endTimeMs = span.endTime[0] * 1000 + span.endTime[1] / 1_000_000;
            const duration = endTimeMs - startTimeMs;

            logger.info(`[messageListener] Processed event: "${eventName}", Duration: ${duration.toFixed(2)} ms`);
        } catch (handlerError) {
            logger.error(
                `[messageListener] Error processing event: "${eventName}". Message details: ${JSON.stringify(pair)}`,
                { error: handlerError }
            );

            span.end(); // Ensure the span is ended even if an error occurs
        }
    });
}

/**
 * Listens for incoming messages and registers a handler to process them.
 * @param {string} eventName - Name of the event/topic/channel.
 * @param {function({ key: any, value: any })} handler - Callback to process message data.
 * @returns {Promise<void>}
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
        logger.info(`[messageListener] Starting listener for event: "${eventName}", Transporter: "${transporterName}"`);

        await retry.retryWithBackoff(
            () => registerListenerWithHandler(eventName, handler),
            5, // Max retry attempts
            1000 // Initial delay (ms)
        );

        logger.info(`[messageListener] Listener successfully started for event: "${eventName}"`);
    } catch (error) {
        logger.error(
            `[messageListener] Failed to start listener for event: "${eventName}", Transporter: "${transporterName}"`,
            { error }
        );
        throw error; // Rethrow error for further handling if needed
    }
}

module.exports = {
    listenMessage,
};
