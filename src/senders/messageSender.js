const logger = require("../utils/logger");
const transporters = require("../transporters");

// Helper functions
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Gets the transporter by name from the transporters module.
 *
 * @param {string} transporterName - Name of the transporter to use.
 * @returns {Object} - Transporter object.
 * @throws Will throw an error if the transporter is not found.
 */
function getTransporter(transporterName) {
    if (!transporterName || !transporters[transporterName]) {
        throw new Error(`Transporter "${transporterName}" not found.`);
    }
    return transporters[transporterName];
}

// Dynamically get the transporter (e.g., kafka, rabbitmq, redis )
const transporter = getTransporter("redis");
const transporter_name = transporter.Name;

/**
 * Retries the provided action with exponential backoff.
 *
 * @param {Function} action - The async function to retry.
 * @param {number} [maxRetries=3] - Maximum number of retries.
 * @param {number} [initialDelay=500] - Initial delay in milliseconds.
 * @returns {Promise<void>}
 */
async function retryWithBackoff(action, maxRetries = 3, initialDelay = 500) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await action();
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) throw error;

            const delayTime = initialDelay * Math.pow(2, attempt - 1); // Delay doubles each retry
            logger.warning(`[Retry] Attempt ${attempt} failed. Retrying in ${delayTime}ms...`);
            await delay(delayTime);
        }
    }
}

/**
 * Executes the provided async action with a timeout.
 *
 * @param {Function} action - The async function to execute.
 * @param {number} timeoutMs - Timeout duration in milliseconds.
 * @returns {Promise<any>} - The result of the action.
 * @throws Will throw an error if the operation times out.
 */
async function withTimeout(action, timeoutMs) {
    return Promise.race([
        action(),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Operation timed out")), timeoutMs)
        ),
    ]);
}

/**
 * Calculates the batch size dynamically based on the total number of messages.
 *
 * @param {number} totalMessages - Total number of messages to process.
 * @returns {number} - Batch size.
 */
function calculateBatchSize(totalMessages) {
    if (totalMessages <= 50) return 10; // Small groups
    if (totalMessages <= 200) return 20; // Medium groups
    return 50; // Large groups
}

/**
 * Sends a message to the specified topic using the configured transport system.
 * Implements retry logic for transient errors and enhances performance with batch processing.
 *
 * @param {string} eventName -  The event to send the message to.
 *                              "eventName" or "topicName" or "channelName"
 * @param {Object} pair - The data to send as the message.
 * @param {JSON} pair.key - The key of the message (optional).
 * @param {JSON} pair.value - The value of the message (required).
 * 
 * @returns {Promise<void>} - A promise that resolves when the message is sent.
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
    try {
        logger.debug(`[messageSender] [sendMessage] [debug] Starting to send message to ${eventName}, transport: ${transporter_name}`, pair);

        // Send message with retry logic
        await retryWithBackoff(
            () => withTimeout(() => transporter.sendMessage(eventName, pair), 5000), // 5s timeout
        );
        logger.info(`[messageSender] [sendMessage] ${eventName}`, pair);
    } catch (error) {
        logger.error(`[messageSender] [sendMessage] [error] Failed to send message to ${eventName}, error: ${error.message}, transport: ${transporter_name}`, pair);
        throw new Error(`Failed to send message after retries: ${error.message}`);
    }
}

/**
 * High-level function to send messages to a transport system.
 * This function ensures proper error handling and operational control.
 *
 * @param {string} eventName - The event name or topic name to send messages to.
 * @param {Array<Object>} pairs - List of key-value pairs to send.
 *
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
    try {
        logger.info(`[messageSender] [sendMessages] [info] Preparing to send ${pairs.length} messages to ${eventName}.`, pairs);

        const batchSize = calculateBatchSize(pairs.length);
        for (let i = 0; i < pairs.length; i += batchSize) {
            const batch = pairs.slice(i, i + batchSize);

            logger.debug(`[messageSender] [sendMessages] [debug] Sending batch of ${batch.length} messages to ${eventName}.`, batch);
            await retryWithBackoff(
                () => withTimeout(() => transporter.sendMessages(eventName, batch), 10000), // 10s timeout
            );

            logger.info(`[messageSender] [sendMessages] [info] Successfully sent batch of ${batch.length} messages to ${eventName}.`);
        }
    } catch (error) {
        logger.error(`[messageSender] [sendMessages] [error] Failed to send messages to ${eventName}. Error: ${error.message}`, pairs);
        throw error; // Notify higher-level systems
    }
}

module.exports = { sendMessage, sendMessages };
