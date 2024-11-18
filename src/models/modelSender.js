/**
 * Model Sender
 * src/models/ModelSender.js
 */
const { sendMessage } = require("../senders/MessageSender");
const logger = require("../utils/logger");

/**
 * Sends a model to the specified topic.
 * @param {string} schema - The schema type.
 * @param {string} eventName - The event topic name.
 * @param {Object} pair - The key-value pair to send.
 */
async function sendModel(schema, eventName, pair) {
    try {
        logger.info(`[ModelSender] Preparing to send data to topic "${eventName}" with schema "${schema}".`);
        const enrichedPair = schema ? { schema, ...pair } : pair;

        await sendMessage(eventName, enrichedPair);

        logger.info(`[ModelSender] Successfully sent data to topic "${eventName}".`);
    } catch (error) {
        logger.error(`[ModelSender] Error sending data to topic "${eventName}": ${error.message}`);
        throw new Error(`Failed to send model: ${error.message}`);
    }
}

module.exports = { sendModel };
