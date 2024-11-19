/**
 * Alert handler
 * src/handlers/alertHandler.js
 */
const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");


/**
 * Handles incoming alert messages.
 * @param {Object} model - The incoming model.
 * @throws Logs and handles errors in processing the model.
 */
async function handleAlert(model) {
    try {
        logger.debug("[handleAlert] Received model. Validating...");
        const data = await handleMessage(model); // Base message handling
        
        const { content, level } = data;

        logger.info(`[handleAlert] Alert processed successfully. Level: ${level}, Content: ${content}`);
        // Additional processing can be added here.
    } catch (error) {
        logger.error(`[handleAlert] Error processing alert: ${error.message}`, {
            model,
            stack: error.stack,
        });
    }
}

module.exports = { handleAlert };
