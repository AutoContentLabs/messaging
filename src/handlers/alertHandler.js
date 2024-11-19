/**
 * Alert handler
 * src/handlers/alertHandler.js
 */
const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Handles incoming alert messages.
 * @param {Object} model - The incoming model.
 */
async function handleAlert(model) {
    try {
        logger.debug("[handleAlert] Processing alert...");

        // Base message handling, including validation
        const data = await handleMessage(model);

        const { content, level, timestamp } = data;
        logger.info(`[handleAlert] Alert processed: Level: ${level}, Content: ${content}, Timestamp: ${timestamp}`);

        // Add additional processing here if needed
    } catch (error) {
        logger.error(`[handleAlert] Error processing alert: ${error.message}`, {
            model,
            stack: error.stack,
        });
    }
}

module.exports = { handleAlert };
