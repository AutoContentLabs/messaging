/**
 * Alert handler
 * src/handlers/alertHandler.js
 */
const logger = require("../utils/logger");
const { handleMessage } = require("./messageHandler");

/**
 * Validates the alert model.
 * @param {Object} model - The alert model.
 * @throws Will throw an error if the model is invalid.
 */
function validateAlertModel(data) {
    if (!data?.id || !data?.timestamp || !data?.content || !data?.level) {
        throw new Error("Invalid alert data. Required fields: id, timestamp, content, level.");
    }
    if (typeof data.content !== "string" || typeof data.level !== "string") {
        throw new Error("'content' and 'level' must be strings.");
    }
    const validLevels = ["info", "warning", "error"];
    if (!validLevels.includes(data.level)) {
        throw new Error(`Invalid level: ${data.level}. Valid levels are: ${validLevels.join(", ")}`);
    }
}

/**
 * Handles incoming alert messages.
 * @param {Object} model - The incoming model.
 * @throws Logs and handles errors in processing the model.
 */
async function handleAlert(model) {
    try {
        logger.debug("[handleAlert] Received model. Validating...");
        const data = await handleMessage(model); // Base message handling
        validateAlertModel(data);
        const { id, timestamp, content, level } = data;

        logger.info(`[handleAlert] Alert processed successfully. ID: ${id}, Timestamp: ${timestamp}, Level: ${level}, Content: ${content}`);
        // Additional processing can be added here.
    } catch (error) {
        logger.error(`[handleAlert] Error processing alert: ${error.message}`, {
            model,
            stack: error.stack,
        });
    }
}

module.exports = { handleAlert };
