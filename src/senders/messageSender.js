/**
 * Message Sender with enhanced telemetry, batch processing, and retry logic.
 * src/senders/messageSender.js
 */

const config = require("../transporters/config");
const { logger, retry, batchSize, Telemetry } = require("@auto-content-labs/messaging-utils");
const telemetry = new Telemetry(config.SERVICE_NAME, config.EXPORTER_CONFIG);
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
 * @returns {Promise<object>} - Telemetry and status details.
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
    let retries = 0;
    const startTimeMs = Date.now();
    try {
        logger.debug(`[messageSender] Sending message to "${eventName}" via "${transporterName}"`, { pair });

        await retry.retryWithBackoff(
            async () => {
                retries++;
                await retry.withTimeout(() => transporter.sendMessage(eventName, pair), 5000);
            },
            5, // Retry up to 5 times
            1000 // Initial delay in ms
        );

        logger.info(`[messageSender] Successfully sent message to "${eventName}"`, { pair });
        return {
            success: true,
            eventName,
            key: pair.key,
            duration: Date.now() - startTimeMs,
            retries,
        };
    } catch (error) {
        logger.error(`[messageSender] Failed to send message to "${eventName}"`, { error, pair });
        return {
            success: false,
            eventName,
            key: pair.key,
            duration: Date.now() - startTimeMs,
            retries,
            error: error.message,
        };
    } finally {
        span.end();
    }
}

/**
 * Sends multiple messages in batches with telemetry and retry logic.
 * @param {string} eventName - Topic or channel name.
 * @param {Array<object>} pairs - Array of message key-value pairs to send.
 * @returns {Promise<object>} - Batch processing summary.
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
    const startTimeMs = Date.now();
    let successfulMessages = 0;
    let failedMessages = 0;

    const batchResults = [];

    try {
        logger.info(`[messageSender] Starting batch send to "${eventName}", Total Messages: ${pairs.length}, Batch Size: ${size}`);

        for (let i = 0; i < totalBatches; i++) {
            const batch = pairs.slice(i * size, (i + 1) * size);
            const span = spans[i];
            const batchStartTime = Date.now();

            try {
                await retry.retryWithBackoff(
                    async () => {
                        await retry.withTimeout(() => transporter.sendMessages(eventName, batch), 10000);
                    },
                    5, // Retry up to 5 times
                    2000 // Initial delay in ms
                );

                logger.info(`[messageSender] Batch ${i + 1}/${totalBatches} sent successfully`, { batch });
                successfulMessages += batch.length;
                batchResults.push({
                    batchIndex: i + 1,
                    success: true,
                    messageCount: batch.length,
                    duration: Date.now() - batchStartTime,
                });
            } catch (batchError) {
                logger.error(`[messageSender] Failed to send batch ${i + 1}/${totalBatches}`, { batchError, batch });
                failedMessages += batch.length;
                batchResults.push({
                    batchIndex: i + 1,
                    success: false,
                    messageCount: batch.length,
                    duration: Date.now() - batchStartTime,
                    error: batchError.message,
                });
            } finally {
                span.end();
            }
        }

        logger.info(`[messageSender] Successfully sent ${successfulMessages} messages out of ${pairs.length} in ${totalBatches} batches.`);
        return {
            success: failedMessages === 0,
            eventName,
            totalMessages: pairs.length,
            successfulMessages,
            failedMessages,
            duration: Date.now() - startTimeMs,
            batches: batchResults,
        };
    } catch (error) {
        logger.error(`[messageSender] Failed to send all messages to "${eventName}"`, { error });
        return {
            success: false,
            eventName,
            totalMessages: pairs.length,
            successfulMessages,
            failedMessages,
            duration: Date.now() - startTimeMs,
            error: error.message,
            batches: batchResults,
        };
    } finally {
        spans.forEach((span) => span.end());
    }
}

module.exports = { sendMessage, sendMessages };
