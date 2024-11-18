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
        logger.debug(`[ModelSender] Preparing data for "${eventName}" with schema "${schema}"`);
        const enrichedPair = schema ? { schema, ...pair } : pair;

        logger.debug("[ModelSender] Sending enriched pair:", enrichedPair);
        await sendMessage(eventName, enrichedPair);

        logger.debug(`[ModelSender] Successfully sent to "${eventName}" with schema "${schema}"`);
    } catch (error) {
        logger.error(`[ModelSender] Error sending to "${eventName}": ${error.message}`);
        throw new Error(`Failed to send model: ${error.message}`);
    }
}

module.exports = { sendModel };
