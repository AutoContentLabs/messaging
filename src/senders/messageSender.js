/**
 * Message Sender with enhanced telemetry, batch processing, and retry logic.
 * src/senders/messageSender.js
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

const { logger, retry, batchSize, Telemetry } = require("@auto-content-labs/messaging-utils");
const telemetry = new Telemetry(serviceName, exporterConfig);
const transporters = require("../transporters");

/**
 * Retrieves the transporter by name from the transporters module.
 * @param {string} transporterName - Name of the transporter.
 * @returns {object} - Transporter instance.
 * @throws {Error} - If the transporter is not found.
 */
function getTransporter(transporterName) {
    if (!transporterName || !transporters[transporterName]) {
        throw new Error(`Transporter "${transporterName}" not found.`);
    }
    return transporters[transporterName];
}

// Dynamically load transporter
const transporter = getTransporter(config.MESSAGE_SYSTEM);
const transporterName = transporter.Name;

/**
 * Sends a single message with retry logic and telemetry.
 * @param {string} eventName - Topic or channel name.
 * @param {object} pair - The message key-value pair to send.
 * @returns {Promise<void>}
 * 
 * @example
 * 
 * // topic = channel = event
 * const eventName = "test";
 * const pair = {
 *  key: { id: 1 }, value: { content: "Message 1" }
 * };
 * 
 * sendMessage(eventName, pair);
 *
*/
async function sendMessage(eventName, pair) {
    const span = telemetry.start("send", eventName, pair);
    try {
        logger.debug(`[messageSender] Sending message to "${eventName}" via "${transporterName}"`, { pair });

        await retry.retryWithBackoff(
            () => retry.withTimeout(() => transporter.sendMessage(eventName, pair), 5000),
            5, // Retry up to 5 times
            1000 // Initial delay in ms
        );

        logger.info(`[messageSender] Successfully sent message to "${eventName}"`, { pair });
    } catch (error) {
        logger.error(`[messageSender] Failed to send message to "${eventName}"`, { error, pair });
        throw new Error(`Failed to send message after retries: ${error.message}`);
    } finally {
        span.end();
    }
}

/**
 * Sends multiple messages in batches with telemetry and retry logic.
 * @param {string} eventName - Topic or channel name.
 * @param {Array<object>} pairs - Array of message key-value pairs to send.
 * @returns {Promise<void>}
 * 
 * @example
 * 
 * // topic = channel = event
 * const eventName = "test";
 * const pairs = [
 *  { key: { id: 1 }, value: { content: "Message 1" } },
 *  { key: { id: 2 }, value: { content: "Message 2" } },
 *  { key: { id: 3 }, value: { content: "Message 3" } },
 * ];
 * 
 * sendMessages(eventName, pairs);
 * 
*/
async function sendMessages(eventName, pairs) {
    const size = batchSize(pairs.length);
    const totalBatches = Math.ceil(pairs.length / size);
    const spans = telemetry.startBatch("sendBatch", eventName, pairs);

    try {
        logger.info(`[messageSender] Starting batch send to "${eventName}", Total Messages: ${pairs.length}, Batch Size: ${size}`);

        for (let i = 0; i < totalBatches; i++) {
            const batch = pairs.slice(i * size, (i + 1) * size);
            const span = spans[i];

            try {
                await retry.retryWithBackoff(
                    () => retry.withTimeout(() => transporter.sendMessages(eventName, batch), 10000),
                    5, // Retry up to 5 times
                    2000 // Initial delay in ms
                );

                logger.info(`[messageSender] Batch ${i + 1}/${totalBatches} sent successfully`, { batch });
            } catch (batchError) {
                logger.error(`[messageSender] Failed to send batch ${i + 1}/${totalBatches}`, { batchError, batch });
                throw batchError; // Stop processing further batches on error
            } finally {
                span.end();
            }
        }

        logger.info(`[messageSender] Successfully sent all ${totalBatches} batches to "${eventName}"`);
    } catch (error) {
        logger.error(`[messageSender] Failed to send all messages to "${eventName}"`, { error });
        throw error;
    } finally {
        spans.forEach((span) => span.end());
    }
}

module.exports = { sendMessage, sendMessages };
