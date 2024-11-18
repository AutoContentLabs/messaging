/**
 * Alert sender
 * src/senders/alertSender.js
 */
const { topics } = require("../topics");
const Model = require("../models/Model");
const logger = require("../utils/logger.js");

const alertModel = new Model(`${topics.alert}_Schema`, topics.alert);

/**
 * Validates the alert model.
 * @param {Object} model - The alert model.
 * @throws Will throw an error if the model is invalid.
 */
function validateAlertModel(model) {
    if (!model?.content || !model?.level) {
        throw new Error("Invalid alert data: 'content' and 'level' are required.");
    }
    if (typeof model.content !== "string" || typeof model.level !== "string") {
        throw new Error("'content' and 'level' must be strings.");
    }
    const validLevels = ["info", "warning", "error"];
    if (!validLevels.includes(model.level)) {
        throw new Error(`Invalid level: ${model.level}. Valid levels are: ${validLevels.join(", ")}`);
    }
}

/**
 * Sends an alert to the specified topic with validation.
 * @param {Object} model - The alert model.
 * @param {string} model.content - The content of the alert.
 * @param {string} model.level - The severity level of the alert.
 * @throws Will throw an error if 'content' or 'level' is missing or invalid.
 */
async function sendAlert(model) {
    try {
        validateAlertModel(model);
        logger.debug(`[AlertSender] Preparing to send alert`, model);
        await alertModel.send(model);
        logger.info("[AlertSender] Alert sent successfully.");
    } catch (error) {
        logger.error(`[AlertSender] Failed to send alert: ${error.message}`);
        throw error;
    }
}

module.exports = { sendAlert };
